import { env } from "@/env";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { loginUserSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import bcrypt from "bcryptjs";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_SECRET_ID,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = loginUserSchema.parse(credentials);

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user?.password) return null;

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) return user;

        return null;
      },
    }),
  ],
  events: {
    linkAccount: async ({ user }) => {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ token }) => {
      if (!token.sub) return null;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });

      if (!existingUser) return null;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
