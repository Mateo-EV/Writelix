import { env } from "@/env";
import { pc } from "@/lib/pinecone";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files, FileStatus, FileType } from "@/server/db/schema";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { STORAGE_URL } from "@/config";
import { PineconeStore } from "@langchain/pinecone";

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
      status: FileStatus.PENDING,
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

export const manageFileUploaded = async ({
  fileId,
  fileKey,
  fileType,
}: {
  fileId: string;
  fileKey: string;
  fileType: FileType;
}) => {
  console.log("hi");

  const fileUrl = STORAGE_URL + fileKey;
  const request = await fetch(fileUrl);

  const fileBlob = await request.blob();
  const loader = new PDFLoader(fileBlob);
  const pageLevelDocs = await loader.load();

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
