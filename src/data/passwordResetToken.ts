import { db } from "@/server/db";
import { passwordResetTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getPasswordResetTokenByToken(token: string) {
  try {
    return await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
  } catch {
    return null;
  }
}
