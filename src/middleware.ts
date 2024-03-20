import { NextResponse } from "next/server";
import { auth } from "./server/auth";
import { ratelimit } from "./lib/redis";

export default auth(async (req) => {
  const ip = req.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success)
    return NextResponse.json("Rate limit exceeded", { status: 429 });

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoutes = [
    "/login",
    "/register",
    "/new-verification",
    "/reset-password",
  ].includes(nextUrl.pathname);
  const isApiAuthRoutes = nextUrl.pathname.startsWith("/api/trpc/auth");

  if (isAuthRoutes && isLoggedIn)
    return NextResponse.redirect(new URL("/dashboard", nextUrl));

  if (isApiAuthRoutes && isLoggedIn)
    return NextResponse.json(
      {
        message: "FORBIDDEN",
      },
      { status: 403 },
    );

  if (!isLoggedIn && isProtectedRoute)
    return NextResponse.redirect(new URL("/login", nextUrl));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|api/trpc|_next).*)", "/(api/trpc/auth.*)"],
};
