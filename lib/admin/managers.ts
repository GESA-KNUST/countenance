import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { type CmaEntryItem, LOCALE, cma, cmaAll } from "./cma";

export const MANAGER_TYPE = "siteManager";

export type ManagerRole = "owner" | "manager";
export type ManagerStatus = "invited" | "active" | "revoked";

export interface Manager {
  id: string;
  email: string;
  name: string;
  role: ManagerRole;
  status: ManagerStatus;
  invitedByEmail: string | null;
  inviteExpiresAt: string | null;
  lastSeenAt: string | null;
  hasPendingInvite: boolean;
}

const INVITE_DAYS = 7;

const CACHE_TTL_MS = 60 * 1000;
let cache: { at: number; items: Manager[] } | null = null;

export function forgetManagers() {
  cache = null;
}

function text(entry: CmaEntryItem, field: string): string | null {
  const value = entry.fields?.[field]?.[LOCALE];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toManager(entry: CmaEntryItem): Manager | null {
  const email = text(entry, "email");
  if (!email) return null;

  const role = text(entry, "role") === "owner" ? "owner" : "manager";
  const rawStatus = text(entry, "status");
  const status: ManagerStatus =
    rawStatus === "active" || rawStatus === "revoked" || rawStatus === "invited"
      ? rawStatus
      : "invited";

  return {
    id: entry.sys.id,
    email: email.toLowerCase(),
    name: text(entry, "name") ?? email.split("@")[0],
    role,
    status,
    invitedByEmail: text(entry, "invitedByEmail"),
    inviteExpiresAt: text(entry, "inviteExpiresAt"),
    lastSeenAt: text(entry, "lastSeenAt"),
    hasPendingInvite: Boolean(text(entry, "inviteTokenHash")),
  };
}

export async function allManagers(): Promise<Manager[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.items;

  const entries = await cmaAll(`/entries?content_type=${MANAGER_TYPE}`);
  const items = entries.map(toManager).filter((item): item is Manager => item !== null);

  cache = { at: Date.now(), items };
  return items;
}

export async function managerById(id: string): Promise<Manager | null> {
  return (await allManagers()).find((item) => item.id === id) ?? null;
}

export async function managerByEmail(email: string): Promise<Manager | null> {
  const wanted = email.trim().toLowerCase();
  return (await allManagers()).find((item) => item.email === wanted) ?? null;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sameHash(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

async function writeFields(id: string, fields: Record<string, unknown>) {
  const entry = (await cma(`/entries/${id}`)) as CmaEntryItem | null;
  if (!entry) return null;

  const merged: Record<string, Record<string, unknown>> = {};
  for (const [key, value] of Object.entries(entry.fields ?? {})) {
    if (value) merged[key] = value;
  }
  for (const [key, value] of Object.entries(fields)) {
    if (value === null) delete merged[key];
    else merged[key] = { [LOCALE]: value };
  }

  const saved = await cma(`/entries/${id}`, {
    method: "PUT",
    version: entry.sys.version,
    body: { fields: merged },
  });

  forgetManagers();
  return saved;
}

export interface CreatedInvite {
  manager: Manager;
  token: string;
}

export async function inviteManager(options: {
  email: string;
  name: string;
  role: ManagerRole;
  invitedByEmail: string;
}): Promise<CreatedInvite | { error: string }> {
  const email = options.email.trim().toLowerCase();
  const name = options.name.trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "That does not look like an email address." };
  }
  if (!name) return { error: "Please add their name." };

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const existing = await managerByEmail(email);

  if (existing) {
    await writeFields(existing.id, {
      name,
      role: options.role,
      status: "invited",
      inviteTokenHash: hashToken(token),
      inviteExpiresAt: expiresAt,
      invitedByEmail: options.invitedByEmail,
    });

    const refreshed = await managerByEmail(email);
    return refreshed ? { manager: refreshed, token } : { error: "Could not save the invite." };
  }

  const created = await cma("/entries", {
    method: "POST",
    contentType: MANAGER_TYPE,
    body: {
      fields: {
        email: { [LOCALE]: email },
        name: { [LOCALE]: name },
        role: { [LOCALE]: options.role },
        status: { [LOCALE]: "invited" },
        inviteTokenHash: { [LOCALE]: hashToken(token) },
        inviteExpiresAt: { [LOCALE]: expiresAt },
        invitedByEmail: { [LOCALE]: options.invitedByEmail },
      },
    },
  });

  forgetManagers();

  const manager = created ? toManager(created as CmaEntryItem) : null;
  return manager ? { manager, token } : { error: "Could not save the invite." };
}

export async function inviteForToken(token: string): Promise<Manager | null> {
  if (!token) return null;

  const wanted = hashToken(token);
  const entries = await cmaAll(`/entries?content_type=${MANAGER_TYPE}&fields.status=invited`);

  for (const entry of entries) {
    const stored = entry.fields?.inviteTokenHash?.[LOCALE];
    if (typeof stored !== "string" || !sameHash(stored, wanted)) continue;

    const manager = toManager(entry);
    if (!manager) return null;

    const expires = manager.inviteExpiresAt ? Date.parse(manager.inviteExpiresAt) : 0;
    if (!Number.isFinite(expires) || expires < Date.now()) return null;

    return manager;
  }

  return null;
}

export async function acceptInvite(id: string, name: string) {
  await writeFields(id, {
    name,
    status: "active",
    inviteTokenHash: null,
    inviteExpiresAt: null,
    lastSeenAt: new Date().toISOString(),
  });
}

export async function revokeManager(id: string) {
  await writeFields(id, { status: "revoked", inviteTokenHash: null, inviteExpiresAt: null });
}

export async function setManagerRole(id: string, role: ManagerRole) {
  await writeFields(id, { role });
}

export async function touchManager(id: string) {
  await writeFields(id, { lastSeenAt: new Date().toISOString() });
}

export async function ownerCount(): Promise<number> {
  const items = await allManagers();
  return items.filter((item) => item.role === "owner" && item.status === "active").length;
}
