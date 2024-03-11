import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files, FileStatus, FileType } from "@/server/db/schema";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

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
    .returning({ id: files.id });

  if (!fileDB) throw new UploadThingError("Something went wrong");

  return { fileId: fileDB.id };
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
