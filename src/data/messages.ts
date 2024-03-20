import { db } from "@/server/db";
import { files, messages } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getLastChatFromUser(userId: string) {
  const [file] = await db
    .select({ id: files.id })
    .from(files)
    .leftJoin(messages, eq(files.id, messages.fileId))
    .orderBy(desc(messages.createdAt))
    .where(eq(files.userId, userId))
    .limit(1);

  return file;
}
