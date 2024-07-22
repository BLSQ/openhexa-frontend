import { trackPageView } from "core/helpers/analytics";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXCLUDED_PATHS = [
  "static",
  "CheckWorkspaceAvailability",
  "SidebarMenu",
  "auth",
];

// This middleware will rewrite the request to the fallback server
export function middleware(request: NextRequest) {
  const srcUrl = new URL(request.url);

  if (
    srcUrl.pathname.startsWith("/graphql") &&
    !EXCLUDED_PATHS.some((path) => srcUrl.pathname.includes(path))
  ) {
    trackPageView(request);
  }

  if (srcUrl.pathname.startsWith("/analytics")) {
    // remove the trailing slash
    const pathname = srcUrl.pathname.replace(/\/$/, "");
    return NextResponse.rewrite(
      new URL(pathname, process.env.OPENHEXA_BACKEND_URL),
    );
  }

  return NextResponse.rewrite(
    new URL(srcUrl.pathname + srcUrl.search, process.env.OPENHEXA_BACKEND_URL),
  );
}

export const config = {
  matcher: [
    "/graphql/:path*" /* GraphQL */,
    "/admin/:path*" /* Django Admin */,
    "/static/:path*" /* Static files of Django */,
    "/auth/logout",
    "/analytics/events",
  ],
};
