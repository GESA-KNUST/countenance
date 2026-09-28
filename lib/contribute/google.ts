import { randomBytes } from "node:crypto";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

const ALLOWED_DOMAIN = process.env.AUTH_ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase();

export const STATE_COOKIE = "gesa_writer_state";

export interface GoogleIdentity {
  email: string;
  name: string;
}

export function newState() {
  return randomBytes(16).toString("hex");
}

export function authorizeUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.AUTH_GOOGLE_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  if (ALLOWED_DOMAIN) params.set("hd", ALLOWED_DOMAIN);
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

export function domainAllowed(email: string) {
  if (!ALLOWED_DOMAIN) return true;
  return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
}

function readIdToken(idToken: string): GoogleIdentity | null {
  const payload = idToken.split(".")[1];
  if (!payload) return null;

  let claims: Record<string, unknown>;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }

  const email = typeof claims.email === "string" ? claims.email.trim().toLowerCase() : "";
  const audience = claims.aud;
  const expiry = typeof claims.exp === "number" ? claims.exp * 1000 : 0;

  if (!email) return null;
  if (claims.email_verified === false) return null;
  if (audience !== process.env.AUTH_GOOGLE_ID) return null;
  if (!expiry || Date.now() > expiry) return null;

  return {
    email,
    name: typeof claims.name === "string" ? claims.name : email.split("@")[0],
  };
}

export async function exchangeCode(
  code: string,
  redirectUri: string
): Promise<GoogleIdentity | null> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.AUTH_GOOGLE_ID ?? "",
      client_secret: process.env.AUTH_GOOGLE_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const token = (await res.json()) as { id_token?: string };
  if (!token.id_token) return null;

  return readIdToken(token.id_token);
}
