import { FileType, documentations, files } from "@/server/db/schema";
import { or, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";

export const homeRouter = createTRPCRouter({
  getFilesAndDocumentation: authProcedure
    .input(
      z.object({
        type: z
          .union([z.nativeEnum(FileType), z.literal("creations")])
          .optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { type, search } }) => {
      const whereClause = or(
        type ? sql`type = '${type}'` : undefined,
        search ? sql`title like %${search}%` : undefined,
      );

      const filesFiltered = ctx.db
        .select({
          id: files.id,
          title: files.name,
          key: sql<string | null>`key`.as("key"),
          type: sql<NonNullable<typeof type>>`${files.type}`.as("type"),
        })
        .from(files);
      const documentationsFiltered = ctx.db
        .select({
          id: documentations.id,
          title: documentations.title,
          key: sql<string | null>`null`.as("key"),
          type: sql<NonNullable<typeof type>>`'creations'`.as("type"),
        })
        .from(documentations);

      const unionQuery = unionAll(filesFiltered, documentationsFiltered).as(
        "sq",
      );

      const data = await ctx.db.select().from(unionQuery).where(whereClause);

      return data;
    }),
});
