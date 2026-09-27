import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "gesa_admin";
const SESSION_DAYS = 30;

const PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET = process.env.ADMIN_SESSION_SECRET;

export function isAuthConfigured() {
  return Boolean(PASSWORD && SECRET);
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

export function checkPassword(submitted: string) {
  if (!PASSWORD) return false;
  return safeEqual(submitted, PASSWORD);
}

export function createSessionValue() {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const nonce = randomBytes(8).toString("hex");
  const payload = `${expiry}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionValue(value: string | undefined) {
  if (!value || !SECRET) return false;

  const parts = value.split(".");
  if (parts.length !== 3) return false;

  const [expiry, nonce, signature] = parts;
  if (!safeEqual(signature, sign(`${expiry}.${nonce}`))) return false;

  const expiresAt = Number(expiry);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

export async function isSignedIn() {
  const store = await cookies();
  return isValidSessionValue(store.get(SESSION_COOKIE)?.value);
}
