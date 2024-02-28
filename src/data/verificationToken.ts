import "server-only";

import { db } from "@/server/db";
import {
  type VerificationToken,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getVerificationTokenByToken(token: string) {
  try {
    return await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
  } catch {
    return null;
  }
}

export async function verifyEmail(verificationToken: VerificationToken) {
  try {
    if (verificationToken.expires < new Date()) {
      return { status: "error" as const, message: "Token has expired" };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, verificationToken.userId));

      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.userId, verificationToken.userId));
    });

    return {
      status: "success" as const,
      message: "Email verified succesfully",
    };
  } catch {
    return {
      status: "error" as const,
      message: "Something went wrong while verifying email",
    };
  }
}
