import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const WRITER_COOKIE = "gesa_writer";
const SESSION_DAYS = 30;

/**
 * The writer session is signed with a key derived from the admin secret rather
 * than the secret itself, so a cookie handed to the public can never be
 * mistaken for — or used to forge — an admin one.
 */
const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET;
const SECRET = ADMIN_SECRET
  ? createHmac("sha256", ADMIN_SECRET).update("contributor-session-v1").digest("hex")
  : undefined;

export interface Writer {
  email: string;
  name: string;
  picture: string;
}

function sign(payload: string) {
  return createHmac("sha256", SECRET as string).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function isSignInConfigured() {
  return Boolean(SECRET && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

export function createWriterValue(writer: Writer) {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ ...writer, expiry })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readWriterValue(value: string | undefined): Writer | null {
  if (!value || !SECRET) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as Writer & {
      expiry?: number;
    };
    if (!data.expiry || Date.now() > data.expiry) return null;
    if (!data.email) return null;
    return { email: data.email, name: data.name ?? "", picture: data.picture ?? "" };
  } catch {
    return null;
  }
}

export const WRITER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

export async function currentWriter(): Promise<Writer | null> {
  const store = await cookies();
  return readWriterValue(store.get(WRITER_COOKIE)?.value);
}
