import { env } from "@/env";
import { Pinecone } from "@pinecone-database/pinecone";

export const pc = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
});
