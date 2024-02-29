import { editProfileByIdSchema } from "@/schemas";
import { authProcedure, createTRPCRouter } from "../trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const profileRouter = createTRPCRouter({
  editProfileById: authProcedure
    .input(editProfileByIdSchema)
    .mutation(async ({ ctx, input: { name } }) => {
      await ctx.db
        .update(users)
        .set({ name })
        .where(eq(users.id, ctx.session.user.id));
      return { message: "Profile updated successfully" };
    }),
});
