import { db } from "@/server/db";
import { passwordResetTokens, verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const generateVerificationToken = async (userId: string) => {
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.userId, userId));

  return (
    await db.insert(verificationTokens).values({ userId, expires }).returning()
  )[0];
};

export const generatePasswordResetToken = async (userId: string) => {
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  return (
    await db.insert(passwordResetTokens).values({ userId, expires }).returning()
  )[0];
};
