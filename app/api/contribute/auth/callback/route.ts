import { NextRequest, NextResponse } from "next/server";
import { STATE_COOKIE, domainAllowed, exchangeCode } from "@/lib/contribute/google";
import {
  WRITER_COOKIE,
  WRITER_COOKIE_OPTIONS,
  createWriterValue,
  isSignInConfigured,
} from "@/lib/contribute/session";
import { LogError } from "@/lib/logger";

function back(request: NextRequest, error?: string) {
  const url = new URL("/contribute", request.nextUrl.origin);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  if (!isSignInConfigured()) return back(request, "setup");

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expected = request.cookies.get(STATE_COOKIE)?.value;

  // Without this the sign-in could be started by another site on the writer's
  // behalf, which is how a session gets planted in someone else's browser.
  if (!code || !state || !expected || state !== expected) {
    return back(request, "signin");
  }

  try {
    const redirectUri = new URL(
      "/api/contribute/auth/callback",
      request.nextUrl.origin
    ).toString();
    const identity = await exchangeCode(code, redirectUri);

    if (!identity) return back(request, "signin");
    if (!domainAllowed(identity.email)) return back(request, "domain");

    const response = back(request);
    response.cookies.set(WRITER_COOKIE, createWriterValue(identity), WRITER_COOKIE_OPTIONS);
    response.cookies.delete(STATE_COOKIE);
    return response;
  } catch (error) {
    LogError("[contribute/auth/callback]", error);
    return back(request, "signin");
  }
}
