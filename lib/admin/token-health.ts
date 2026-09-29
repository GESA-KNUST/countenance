import { LogError } from "@/lib/logger";

const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

export const WARN_WITHIN_DAYS = 60;

export type TokenHealth =
    | { state: "ok"; expiresAt: string; daysLeft: number }
    | { state: "soon"; expiresAt: string; daysLeft: number }
    | { state: "expired" }
    | { state: "unknown" };

interface AccessToken {
    name?: string;
    revokedAt?: string | null;
    sys?: { expiresAt?: string | null; redactedValue?: string | null };
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
let cache: { at: number; health: TokenHealth } | null = null;

function daysUntil(iso: string) {
    const ms = new Date(iso).getTime() - Date.now();
    return Math.floor(ms / (24 * 60 * 60 * 1000));
}

async function readHealth(): Promise<TokenHealth> {
    if (!TOKEN) return { state: "unknown" };

    const response = await fetch("https://api.contentful.com/users/me/access_tokens", {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: "no-store",
    });

    if (response.status === 401) return { state: "expired" };
    if (!response.ok) return { state: "unknown" };

    const body = (await response.json()) as { items?: AccessToken[] };
    const last4 = TOKEN.slice(-4);
    const mine = (body.items ?? []).find(
        (item) => !item.revokedAt && item.sys?.redactedValue === last4
    );

    const expiresAt = mine?.sys?.expiresAt;
    if (!expiresAt) return { state: "unknown" };

    const daysLeft = daysUntil(expiresAt);
    if (daysLeft <= 0) return { state: "expired" };
    return { state: daysLeft <= WARN_WITHIN_DAYS ? "soon" : "ok", expiresAt, daysLeft };
}

export async function tokenHealth(): Promise<TokenHealth> {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.health;

    try {
        const health = await readHealth();
        cache = { at: Date.now(), health };
        return health;
    } catch (error) {
        LogError("Could not check the management token expiry:", error);
        return { state: "unknown" };
    }
}
