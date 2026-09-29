import { NextRequest, NextResponse } from "next/server";
import { LogError } from "@/lib/logger";
import { clientKey, rateLimit } from "@/lib/admin/rate-limit";
import { exchangeCode } from "@/lib/contribute/google";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionValue,
} from "@/lib/admin/session";
import {
  acceptInvite,
  inviteForToken,
  managerByEmail,
  touchManager,
} from "@/lib/admin/managers";
import { ADMIN_INVITE_COOKIE, ADMIN_STATE_COOKIE, adminRedirectUri } from "@/lib/admin/oauth";

function back(request: NextRequest, error: string) {
  const url = new URL("/admin", request.nextUrl.origin);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

function clearTemporaryCookies(response: NextResponse) {
  response.cookies.delete(ADMIN_STATE_COOKIE);
  response.cookies.delete(ADMIN_INVITE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "admin-google"), 20, 15 * 60 * 1000);
  if (!limit.allowed) return back(request, "busy");

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(ADMIN_STATE_COOKIE)?.value;
  const inviteToken = request.cookies.get(ADMIN_INVITE_COOKIE)?.value ?? "";

  if (!code || !state || !expectedState || state !== expectedState) {
    return clearTemporaryCookies(back(request, "signin"));
  }

  try {
    const identity = await exchangeCode(code, adminRedirectUri(request));
    if (!identity) return clearTemporaryCookies(back(request, "signin"));

    const email = identity.email.trim().toLowerCase();
    let manager = await managerByEmail(email);

    if (inviteToken) {
      const invited = await inviteForToken(inviteToken);

      if (!invited) return clearTemporaryCookies(back(request, "invite"));
      if (invited.email !== email) return clearTemporaryCookies(back(request, "mismatch"));

      await acceptInvite(invited.id, identity.name || invited.name);
      manager = await managerByEmail(email);
    }

    if (!manager || manager.status !== "active") {
      return clearTemporaryCookies(back(request, "access"));
    }

    await touchManager(manager.id);

    const response = NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
    response.cookies.set(
      SESSION_COOKIE,
      createSessionValue({
        id: manager.id,
        email: manager.email,
        name: manager.name,
        role: manager.role,
      }),
      SESSION_COOKIE_OPTIONS
    );
    return clearTemporaryCookies(response);
  } catch (error) {
    LogError("[admin/auth/callback]", error);
    return clearTemporaryCookies(back(request, "signin"));
  }
}
