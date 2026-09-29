import { NextRequest, NextResponse } from "next/server";
import { authorizeUrl, newState } from "@/lib/contribute/google";
import {
  ADMIN_INVITE_COOKIE,
  ADMIN_STATE_COOKIE,
  SHORT_COOKIE_OPTIONS,
  adminRedirectUri,
} from "@/lib/admin/oauth";

export async function GET(request: NextRequest) {
  if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    return NextResponse.redirect(new URL("/admin?error=setup", request.nextUrl.origin));
  }

  const state = newState();
  const invite = request.nextUrl.searchParams.get("invite") ?? "";

  const response = NextResponse.redirect(authorizeUrl(adminRedirectUri(request), state));
  response.cookies.set(ADMIN_STATE_COOKIE, state, SHORT_COOKIE_OPTIONS);

  if (invite) {
    response.cookies.set(ADMIN_INVITE_COOKIE, invite, SHORT_COOKIE_OPTIONS);
  }

  return response;
}
