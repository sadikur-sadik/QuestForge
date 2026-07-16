import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/not-logged-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-games/:path*",
    "/add-games/:path*",
    "/my-bucket/:path*",
    "/view-profile/:path*",
    "/my-interactions/:path*",
  ],
};
