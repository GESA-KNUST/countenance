import type { NextRequest } from "next/server";

export const ADMIN_STATE_COOKIE = "gesa_admin_state";
export const ADMIN_INVITE_COOKIE = "gesa_admin_invite";

export function adminRedirectUri(request: NextRequest) {
  return new URL("/api/admin/auth/callback", request.nextUrl.origin).toString();
}

export const SHORT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 600,
};
