import { db } from "@/server/db";
import { files, messages } from "@/server/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getLastChatFromUser(userId: string) {
  const [file] = await db
    .select({
      id: files.id,
      createdAt: sql`coalesce("message"."created_at","file"."created_at")`.as(
        "last_interacted",
      ),
    })
    .from(files)
    .leftJoin(messages, eq(files.id, messages.fileId))
    .orderBy(desc(sql`last_interacted`))
    .where(eq(files.userId, userId))
    .limit(1);

  return file;
}
