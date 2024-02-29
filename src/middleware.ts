import { NextResponse } from "next/server";
import { auth } from "./server/auth";

export default auth((req) => {
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
  console.log(isLoggedIn);

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|api/trpc|_next).*)", "/(api/trpc/auth.*)"],
};
