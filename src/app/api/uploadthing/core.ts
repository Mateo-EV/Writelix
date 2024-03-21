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
import { Document } from "@langchain/core/documents";

export const utapi = new UTApi();

const f = createUploadthing();

const authMiddleware = async (type: FileType.PDF | FileType.AUDIO) => {
  const session = await auth();

  if (!session) throw new UploadThingError("Unauthorized");

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
  });

  return { ...fileDB, type, createdAt: fileDB.createdAt.toUTCString() };
};

const loadFile = {
  [FileType.PDF]: async (blob: Blob) => await new PDFLoader(blob).load(),
  [FileType.AUDIO]: async (blob: Blob) => {
    const file = await toFile(blob, "tmp.mp3", { type: "mp3" });

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    const document = new Document({
      pageContent: transcriptionResponse.text,
      metadata: { soruce: "blob", blobType: blob.type },
    });

    return [document];
  },
  [FileType.WEB]: async (blob: Blob) => await new PDFLoader(blob).load(),
  [FileType.YOUTUBE]: async (blob: Blob) => await new PDFLoader(blob).load(),
};

export const manageFileUploaded = async ({
  fileId,
  fileKey,
  fileType,
}: {
  fileId: string;
  fileKey: string;
  fileType: FileType;
}) => {
  const fileUrl = STORAGE_URL + fileKey;
  const request = await fetch(fileUrl);

  const fileBlob = await request.blob();
  const pageLevelDocs = await loadFile[fileType](fileBlob);

  const pineconeIndex = pc.Index(env.PINECONE_INDEX);
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: env.OPENAI_API_KEY,
  });

  try {
    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: fileId,
    });
    await db.update(files).set({ status: FileStatus.SUCCESS });
  } catch {
    await db.update(files).set({ status: FileStatus.FAILED });
  }
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
