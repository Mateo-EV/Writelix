import { env } from "@/env";
import { pc } from "@/lib/pinecone";
import { getFileById } from "@/server/api/routers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { type NextRequest } from "next/server";

const messageRequestSchema = z.object({
  message: z.string(),
  fileId: z.string(),
});

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { message, fileId } = messageRequestSchema.parse(await req.json());

  const file = await getFileById(fileId, session.user.id);

  if (!file) return new Response("File not found", { status: 404 });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: env.OPENAI_API_KEY,
  });
  const pineconeIndex = pc.Index(env.PINECONE_INDEX);
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.query.messages.findMany({
    where: eq(messages.fileId, fileId),
    orderBy: desc(messages.createdAt),
    limit: 4,
  });

  const formattedMessages = prevMessages
    .map((msg) => [
      {
        role: "user" as const,
        content: msg.content,
      },
      {
        role: "assistant" as const,
        content: msg.response,
      },
    ])
    .flat();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.
            \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            \nCONTEXT:
            ${results.map((r) => r.pageContent).join("\n\n")}`,
      },
      ...formattedMessages,
      { role: "user", content: message },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db
        .insert(messages)
        .values({ content: message, fileId, response: completion });
    },
  });

  return new StreamingTextResponse(stream);
};
