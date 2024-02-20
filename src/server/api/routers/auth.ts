import { loginUserSchema, registerUserSchema } from "@/schemas";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { AuthError } from "next-auth";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(async ({ input: credentials }) => {
      try {
        // await signIn("credentials", { ...credentials, redirect: false });
      } catch (error) {
        if (error instanceof AuthError && error.type === "CredentialsSignin") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid credentials",
          });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong.",
        });
      }

      return { success: true, message: "Successfully Authenticated" };
    }),
  register: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ input: { email, name, password }, ctx }) => {
      // const emailExists = !!(await ctx.db.user.findUnique({
      //   where: { email },
      // }));

      // if (emailExists)
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: "Email already exists",
      //   });

      // const hashedPassword = await bcrypt.hash(password, 10);

      // await ctx.db.user.create({
      //   data: {
      //     name,
      //     email,
      //     password: hashedPassword,
      //   },
      // });

      return { success: true, message: "Successfully Authenticated" };
    }),
});
