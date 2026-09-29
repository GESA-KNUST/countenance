import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { type Manager, type ManagerRole, managerById, managerByEmail } from "./managers";

export const SESSION_COOKIE = "gesa_admin";
const SESSION_DAYS = 30;

const PASSWORD = process.env.ADMIN_PASSWORD;
const ROOT_SECRET = process.env.ADMIN_SESSION_SECRET;

export const OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL ?? "").trim().toLowerCase();
const OWNER_ID = "owner-password";

const SECRET = ROOT_SECRET
  ? createHmac("sha256", ROOT_SECRET).update("manager-session-v1").digest("hex")
  : null;

export interface SignedIn {
  id: string;
  email: string;
  name: string;
  role: ManagerRole;
}

export function isAuthConfigured() {
  return Boolean(PASSWORD && ROOT_SECRET);
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

export function createSessionValue(who: SignedIn) {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ ...who, expiry })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readSessionValue(value: string | undefined): SignedIn | null {
  if (!value || !SECRET) return null;

  const parts = value.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!Number.isFinite(claims.expiry) || claims.expiry <= Date.now()) return null;
    if (typeof claims.email !== "string" || typeof claims.id !== "string") return null;

    return {
      id: claims.id,
      email: claims.email,
      name: typeof claims.name === "string" ? claims.name : claims.email,
      role: claims.role === "owner" ? "owner" : "manager",
    };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

export function ownerSession(): SignedIn {
  return {
    id: OWNER_ID,
    email: OWNER_EMAIL || "owner",
    name: "Owner",
    role: "owner",
  };
}

export async function currentManager(): Promise<SignedIn | null> {
  const store = await cookies();
  const claimed = readSessionValue(store.get(SESSION_COOKIE)?.value);
  if (!claimed) return null;

  if (claimed.id === OWNER_ID) return ownerSession();

  let record: Manager | null = null;
  try {
    record = (await managerById(claimed.id)) ?? (await managerByEmail(claimed.email));
  } catch {
    return claimed;
  }

  if (!record || record.status !== "active") return null;

  return { id: record.id, email: record.email, name: record.name, role: record.role };
}

export async function requireManager(role?: ManagerRole): Promise<SignedIn | null> {
  const who = await currentManager();
  if (!who) return null;
  if (role === "owner" && who.role !== "owner") return null;
  return who;
}

export async function isSignedIn() {
  return (await currentManager()) !== null;
}
