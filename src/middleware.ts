import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPABASE_URL } from "@/constants/supabase";
import {
  sentryPaths,
  userPaths,
  publicPaths,
  apiSorealPaths,
} from "@/constants/paths";
import { ACCESS_TOKEN_COOKIE_KEY } from "@/constants/cookies";

export async function middleware(request: NextRequest) {
  if (
    [
      "/api/get-image",
      "/api/create-image/standard",
      "/api/create-image/premium",
      "/api/create-image/remove-background",
      "/api/create-image/upscale",
    ].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  if (sentryPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.nextUrl.host === "api.soreal.app") {
    if (request.nextUrl.pathname.startsWith("/assets")) {
      return NextResponse.rewrite(
        new URL(
          `${SUPABASE_URL}/storage/v1/object/public/assets${request.nextUrl.pathname.replace("/assets", "")}`,
          request.url
        )
      );
    }

    if (
      request.nextUrl.pathname.startsWith("/storage/v1/object/public/assets")
    ) {
      return NextResponse.rewrite(
        new URL(`${SUPABASE_URL}${request.nextUrl.pathname}`, request.url)
      );
    }

    if (apiSorealPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.rewrite(
        new URL(`/api${request.nextUrl.pathname}`, request.url)
      );
    }
  }

  const isLoggedIn = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  const currentPath = request.nextUrl.pathname;
  if (isLoggedIn) {
    if (!userPaths.includes(currentPath)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (!publicPaths.includes(currentPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
  ],
};
