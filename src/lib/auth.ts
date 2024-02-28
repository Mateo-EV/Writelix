import { auth } from "@/server/auth";
import { cache } from "react";

export const getSession = cache(
  // async () => {
  //   const cookieName =
  //     env.NODE_ENV === "production"
  //       ? "__Secure-authjs.session-token"
  //       : "authjs.session-token";
  //   const token = cookies().get(cookieName)!.value;

  //   const session = (await decode({
  //     token,
  //     secret: env.AUTH_SECRET,
  //     salt: cookieName,
  //   }))!;

  //   return {
  //     name: session.name!,
  //     email: session.email!,
  //     image: session.picture!,
  //   };
  // }

  async () => await auth(),
);
