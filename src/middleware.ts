import { NextResponse } from "next/server";
import { auth } from "./server/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoutes = ["/login", "/register"].includes(nextUrl.pathname);

  if (isAuthRoutes) {
    if (isLoggedIn)
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    return NextResponse.next();
  }

  if (!isLoggedIn && isProtectedRoute)
    return NextResponse.redirect(new URL("/login", nextUrl));

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.ico$).*)"],
};
