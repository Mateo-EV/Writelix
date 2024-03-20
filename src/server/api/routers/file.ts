import { utapi } from "@/app/api/uploadthing/core";
import { INFINITE_QUERY_LIMIT } from "@/config";
import { env } from "@/env";
import { pc } from "@/lib/pinecone";
import { getYoutubeVideoByKey } from "@/lib/youtube";
import { uploadUrlFileSchema } from "@/schemas";
import { db } from "@/server/db";
import { FileStatus, FileType, files, messages } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";

export const getFileById = async (fileId: string, userId: string) => {
  try {
    return await db.query.files.findFirst({
      where: and(eq(files.id, fileId), eq(files.userId, userId)),
    });
  } catch (error) {
    return null;
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
  uploadUrl: authProcedure
    .input(uploadUrlFileSchema)
    .mutation(async ({ ctx, input: { url: key, type, name } }) => {
      if (type === FileType.YOUTUBE) {
        const videoData = await getYoutubeVideoByKey(key);

        if (!videoData)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This video doens't exists",
          });
      }

      const [newFile] = await ctx.db
        .insert(files)
        .values({
          name,
          key,
          type,
          status: FileStatus.PENDING,
          userId: ctx.session.user.id,
        })
        .returning({
          id: files.id,
          createdAt: files.createdAt,
          name: files.name,
          type: files.type,
        });

      if (!newFile) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return { file: newFile, message: "File uploaded successfully" };
    }),
  getFileStatus: authProcedure
    .input(z.string())
    .query(async ({ input: fileId, ctx }) => {
      const file = await getFileById(fileId, ctx.session.user.id);

      if (!file) return { status: FileStatus.PENDING };

      return file.status;
    }),
  deleteByFileId: authProcedure
    .input(z.string())
    .mutation(async ({ input: fileId, ctx }) => {
      const [fileDeleted] = await ctx.db
        .delete(files)
        .where(and(eq(files.id, fileId), eq(files.userId, ctx.session.user.id)))
        .returning();

      if (!fileDeleted)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong",
        });

      void utapi.deleteFiles(fileDeleted.key);
      void pc.index(env.PINECONE_INDEX).namespace(fileDeleted.id).deleteAll();
    }),
  getMessages: authProcedure
    .input(
      z.object({
        fileId: z.string(),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.number().optional(),
      }),
    )
    .query(
      async ({
        ctx,
        input: { fileId, cursor, limit = INFINITE_QUERY_LIMIT },
      }) => {
        const file = await getFileById(fileId, ctx.session.user.id);

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        const messagesFiltered = await db.query.messages.findMany({
          offset: cursor ? cursor : undefined,
          where: eq(messages.fileId, fileId),
          limit,
          columns: {
            id: true,
            content: true,
            createdAt: true,
            response: true,
          },
          orderBy: desc(messages.createdAt),
        });

        let nextCursor: typeof cursor;

        if (messagesFiltered.length >= limit) nextCursor = (cursor ?? 0) + 5;

        return {
          messages: messagesFiltered,
          nextCursor,
        };
      },
    ),
});
