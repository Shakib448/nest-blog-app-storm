import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get("Authorization");

  if (!isAuth) {
    return NextResponse.redirect(new URL(`/sign-in`, request.url));
  }
}

export const config = {
  matcher: ["/profile", "/create-post"],
};
