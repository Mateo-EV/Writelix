import { STORAGE_URL } from "@/config";
import { FileType, documentations, files } from "@/server/db/schema";
import { and, desc, sql } from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";

export const homeRouter = createTRPCRouter({
  getFilesAndDocumentation: authProcedure
    .input(
      z.object({
        type: z
          .union([z.nativeEnum(FileType), z.literal("creations")])
          .nullable(),
        search: z.string().nullable(),
      }),
    )
    .query(async ({ ctx, input: { type, search } }) => {
      const whereClause = and(
        type ? sql`"type" = ${type}` : undefined,
        search ? sql`"name" ilike ${"%" + search + "%"}` : undefined,
      );

      const filesFiltered = ctx.db
        .select({
          id: files.id,
          title: files.name,
          key: sql<
            string | null
          >`CASE WHEN type = ${FileType.PDF} THEN (${STORAGE_URL} || key) ELSE key END`.as(
            "key",
          ),
          type: sql<NonNullable<typeof type>>`${files.type}`.as("type"),
          updatedAt: files.updatedAt,
        })
        .from(files);
      const documentationsFiltered = ctx.db
        .select({
          id: documentations.id,
          title: documentations.title,
          key: sql<string | null>`null`.as("key"),
          type: sql<NonNullable<typeof type>>`'creations'`.as("type"),
          updatedAt: documentations.updatedAt,
        })
        .from(documentations);

      const unionQuery = unionAll(filesFiltered, documentationsFiltered).as(
        "sq",
      );

      const data = await ctx.db
        .select()
        .from(unionQuery)
        .where(whereClause)
        .orderBy(desc(sql`"updated_at"`));

      return data;
    }),
});
