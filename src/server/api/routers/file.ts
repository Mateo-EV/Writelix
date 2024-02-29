import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { FileType, files } from "@/server/db/schema";
import { eq, ilike, or } from "drizzle-orm";

export const fileRouter = createTRPCRouter({
  getAll: authProcedure
    .input(
      z.object({
        type: z.nativeEnum(FileType).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { type, search } }) => {
      const whereClause = or(
        type ? eq(files.type, type) : undefined,
        search ? ilike(files.name, `%${search}%`) : undefined,
      );

      const filesFiltered = await ctx.db.query.files.findMany({
        where: or(whereClause),
      });

      return filesFiltered;
    }),
});
