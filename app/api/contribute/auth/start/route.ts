import { NextRequest, NextResponse } from "next/server";
import { STATE_COOKIE, authorizeUrl, newState } from "@/lib/contribute/google";
import { isSignInConfigured } from "@/lib/contribute/session";

export function redirectUri(request: NextRequest) {
  return new URL("/api/contribute/auth/callback", request.nextUrl.origin).toString();
}

export async function GET(request: NextRequest) {
  if (!isSignInConfigured()) {
    return NextResponse.redirect(new URL("/contribute?error=setup", request.nextUrl.origin));
  }

  const state = newState();
  const response = NextResponse.redirect(authorizeUrl(redirectUri(request), state));

  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
