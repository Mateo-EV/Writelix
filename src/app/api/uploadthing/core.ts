import { env } from "@/env";
import { pc } from "@/lib/pinecone";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files, FileStatus, FileType } from "@/server/db/schema";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { toFile } from "openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { STORAGE_URL } from "@/config";
import { PineconeStore } from "@langchain/pinecone";
import { openai } from "@/lib/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { redis } from "@/lib/redis";

export const utapi = new UTApi();

const f = createUploadthing();

const authMiddleware = async (type: FileType.PDF | FileType.AUDIO) => {
  const session = await auth();

  if (!session) throw new UploadThingError("Unauthorized");

  const isInProcess = await redis.get(`isInProcess:${session.user.id}`);

  if (isInProcess)
    throw new UploadThingError({
      code: "FILE_LIMIT_EXCEEDED",
      message: "You'are processing something right now",
    });

  await redis.set(`isInProcess:${session.user.id}`, true);

  return { userId: session.user.id, type };
};

const onUploadComplete = async ({
  metadata: { userId, type },
  file,
}: {
  metadata: Awaited<ReturnType<typeof authMiddleware>>;
  file: {
    name: string;
    key: string;
    url: string;
    size: number;
    customId: string | null;
  };
}) => {
  const [fileDB] = await db
    .insert(files)
    .values({
      name: file.name.replace(/\.[^/.]+$/, ""),
      type,
      status: FileStatus.PROCESSING,
      key: file.key,
      userId,
    })
    .returning({ id: files.id, createdAt: files.createdAt, name: files.name });

  if (!fileDB) throw new UploadThingError("Something went wrong");

  void manageFileUploaded({
    fileId: fileDB.id,
    fileKey: file.key,
    fileType: type,
    userId,
  });

  return { ...fileDB, type, createdAt: fileDB.createdAt.toUTCString() };
};

const loadFile = {
  [FileType.PDF]: async (fileKey: string) => {
    const fileUrl = STORAGE_URL + fileKey;
    const request = await fetch(fileUrl);

    const fileBlob = await request.blob();
    return await new PDFLoader(fileBlob).load();
  },
  [FileType.AUDIO]: async (fileKey: string) => {
    const fileUrl = STORAGE_URL + fileKey;
    const request = await fetch(fileUrl);

    const fileBlob = await request.blob();
    const file = await toFile(fileBlob, "tmp.mp3", { type: "mp3" });

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 1,
    });

    return await splitter.createDocuments(
      [transcriptionResponse.text],
      [{ soruce: "blob", blobType: fileBlob.type }],
    );
  },
  [FileType.WEB]: async (fileKey: string, fileId: string) =>
    await new PuppeteerWebBaseLoader(fileKey, {
      async evaluate(page, browser) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const result = await page.evaluate(() => document.body.innerText);
        const base64 = await page.screenshot({
          type: "png",
          encoding: "binary",
        });

        const file = new File([base64], `sc.png`);

        Object.defineProperty(file, "customId", {
          value: fileId,
          writable: false,
        });

        await utapi.uploadFiles(file);

        await browser.close();

        return result;
      },
    }).load(),
  [FileType.YOUTUBE]: async (fileKey: string) => {
    const youtubeLoader = new YoutubeLoader({
      videoId: fileKey,
      addVideoInfo: true,
    });

    return await youtubeLoader.load();
  },
};

export const manageFileUploaded = async ({
  fileId,
  fileKey,
  fileType,
  userId,
}: {
  fileId: string;
  fileKey: string;
  fileType: FileType;
  userId: string;
}) => {
  try {
    const pageLevelDocs = await loadFile[fileType](fileKey, fileId);

    const pineconeIndex = pc.Index(env.PINECONE_INDEX);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: fileId,
    });
    await db.update(files).set({ status: FileStatus.SUCCESS });
  } catch {
    await db.update(files).set({ status: FileStatus.FAILED });
  }

  await redis.del(`isInProcess:${userId}`);
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await authMiddleware(FileType.PDF))
    .onUploadComplete(onUploadComplete),

  audioUploader: f({ audio: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await authMiddleware(FileType.AUDIO))
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
