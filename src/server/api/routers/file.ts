import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";

export const getFileById = async (fileId: string, userId: string) => {
  try {
    return await db.query.files.findFirst({
      where: and(eq(files.id, fileId), eq(files.userId, userId)),
    });
  } catch (error) {
    return null
  }
};

export const fileRouter = createTRPCRouter({
  getAll: authProcedure.query(async ({ ctx }) => {
    const filesFiltered = await ctx.db.query.files.findMany({
      orderBy: desc(files.updatedAt),
      columns: {
        id: true,
        name: true,
        createdAt: true,
        type: true,
      },
      where: eq(files.userId, ctx.session.user.id),
    });

    return filesFiltered;
  }),
  getByFileId: authProcedure
    .input(z.string())
    .query(async ({ ctx, input: fileId }) => {
      return await getFileById(fileId, ctx.session.user.id);
    }),
});
