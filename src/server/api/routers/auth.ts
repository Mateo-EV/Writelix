import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { sendResetPassword, sendVerficationEmail } from "@/lib/resend";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  createNewPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "@/schemas";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signIn } from "@/server/auth";
import { passwordResetTokens, users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ input: { email, password } }) => {
      try {
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      } catch (error) {
        if (error instanceof AuthError) {
          if (error.type === "CredentialsSignin")
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid credentials",
            });

          if (error.type === "AuthorizedCallbackError")
            return {
              status: "VERIFICATION_LINK_SENT" as const,
              message: "We sent you a verification email",
            };
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong.",
        });
      }

      return {
        status: "AUTHENTICATED" as const,
        message: "Successfully Authenticated!",
      };
    }),
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ input: { email, name, password }, ctx }) => {
      const emailExists = Boolean(
        await ctx.db.query.users.findFirst({ where: eq(users.email, email) }),
      );

      if (emailExists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });

      const hashedPassword = await bcrypt.hash(password, 10);
      const [userCreated] = await ctx.db
        .insert(users)
        .values({ name, email, password: hashedPassword })
        .returning({ id: users.id });
      if (!userCreated) throw new TRPCError({ code: "BAD_REQUEST" });

      const verificationToken = await generateVerificationToken(userCreated.id);

      if (!verificationToken?.token)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was an error while generating token, try login",
        });

      void sendVerficationEmail(email, verificationToken.token);

      return { message: "Confirmation email sent!" };
    }),
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input: { email }, ctx }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, email),
        columns: { id: true, email: true, password: true },
        with: { account: true },
      });

      if (!existingUser?.password || existingUser.account[0]?.type == "oauth")
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid email" });

      const passwordResetToken = await generatePasswordResetToken(
        existingUser.id,
      );

      if (!passwordResetToken)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      void sendResetPassword(existingUser.email, passwordResetToken.token);

      return { message: "Reset email sent!" };
    }),
  createNewPassword: publicProcedure
    .input(createNewPasswordSchema.extend({}))
    .mutation(async ({ input: { password, token }, ctx }) => {
      const passwordReset = await getPasswordResetTokenByToken(token);

      if (!passwordReset || passwordReset.expires < new Date())
        throw new TRPCError({ code: "BAD_REQUEST" });

      const newPasswordHashed = await bcrypt.hash(password, 10);

      await ctx.db
        .update(users)
        .set({ password: newPasswordHashed })
        .where(eq(users.id, passwordReset.userId));

      await ctx.db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.userId, passwordReset.userId));

      return { message: "Password has already been reseted" };
    }),
});
