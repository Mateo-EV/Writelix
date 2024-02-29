import { env } from "@/env";
import { auth } from "@/server/auth";
import { cookies } from "next/headers";
import { cache } from "react";
import { decode } from "next-auth/jwt";

export const getSession = cache(async () => await auth());

export const getSessionFromJWT = async () => {
  const cookieName =
    env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
  const token = cookies().get(cookieName)!.value;

  const session = (await decode({
    token,
    secret: env.AUTH_SECRET,
    salt: cookieName,
  }))!;

  return {
    name: session.name!,
    email: session.email!,
    image: session.picture!,
  };
};
