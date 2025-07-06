import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPABASE_URL } from "@/constants/supabase";
import {
  sentryPaths,
  userPaths,
  publicPaths,
  apiSorealPaths,
  apiSorealExternalPaths,
  paths,
} from "@/constants/paths";
import { ACCESS_TOKEN_COOKIE_KEY } from "@/constants/cookies";
import { planNames } from "./constants/subscription";
import { getUserSubscriptionCookie } from "./lib/cookies/server";

export async function middleware(request: NextRequest) {
  if (sentryPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.nextUrl.host === "api.soreal.app") {
    if (
      Object.keys(apiSorealExternalPaths).includes(request.nextUrl.pathname)
    ) {
      return NextResponse.rewrite(
        new URL(
          apiSorealExternalPaths[
            request.nextUrl.pathname as keyof typeof apiSorealExternalPaths
          ],
          request.url
        )
      );
    }

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
    if (currentPath === paths.pricing) {
      return NextResponse.redirect(new URL(paths.billing, request.url));
    }
    
    if (!userPaths.includes(currentPath)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (currentPath === paths.apiKeys) {
      const userSubscription = await getUserSubscriptionCookie();
      if (
        userSubscription?.planName !== planNames.growth ||
        userSubscription?.isExpired
      ) {
        return NextResponse.redirect(new URL(paths.dashboard, request.url));
      }
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
