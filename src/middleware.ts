// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/collections") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/api/proxy", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
