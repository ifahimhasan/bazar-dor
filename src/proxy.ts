import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic auth gate: product details and profile pages need a session.
 * Pages also verify the session on the server; this just avoids a flash.
 */
export function proxy(request: NextRequest) {
  const hasSession = getSessionCookie(request);
  if (!hasSession) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    url.searchParams.set("reason", "protected");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*", "/profile"],
};
