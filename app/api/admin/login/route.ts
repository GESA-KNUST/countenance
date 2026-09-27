import { NextRequest, NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/admin/rate-limit";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  checkPassword,
  createSessionValue,
  isAuthConfigured,
} from "@/lib/admin/session";

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { message: "The dashboard is not set up yet. Ask a developer to add the password." },
      { status: 503 }
    );
  }

  const limit = rateLimit(clientKey(request, "admin-login"), 8, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        message: `Too many attempts. Please wait ${Math.ceil((limit.retryInSeconds ?? 60) / 60)} minute(s) and try again.`,
      },
      { status: 429 }
    );
  }

  let password = "";
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ message: "That password is not right." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionValue(), SESSION_COOKIE_OPTIONS);
  return response;
}
