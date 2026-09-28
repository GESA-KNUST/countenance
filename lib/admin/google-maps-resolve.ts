import { parseGoogleMapsLink, type Point } from "@/lib/admin/google-maps-link";
import { LogError } from "@/lib/logger";

const MOBILE_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const CONTACT = process.env.GEOCODE_CONTACT_EMAIL ?? "info@gesaknust.com";
const GEOCODE_AGENT = `gesaknust.com admin location picker (${CONTACT})`;

export interface ResolvedPlace extends Point {
  address?: string;
}

const decode = (value: string) => {
  const entities = value.replace(/&amp;/g, "&");
  try {
    return decodeURIComponent(entities);
  } catch {
    return entities;
  }
};

function placeAddressFromHtml(html: string): string | null {
  const match = html.match(/https:\/\/www\.google\.com\/maps\/place\/([^"'<>\s\\&]+)/);
  if (!match) return null;

  const path = decode(match[1]).split("/")[0];
  const address = path.replace(/\+/g, " ").trim();
  return address.length > 2 ? address : null;
}

function placeUrlFromHtml(html: string): string | null {
  const match = html.match(/https:\/\/www\.google\.com\/maps\/place\/[^"'<>\s\\]+/);
  return match ? decode(match[0]) : null;
}

async function geocodeWithFallback(address: string): Promise<Point | null> {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);

  for (let skip = 0; skip < Math.min(parts.length, 3); skip++) {
    const attempt = parts.slice(skip).join(", ");
    if (attempt.length < 3) break;

    const found = await geocode(attempt);
    if (found) return found;
  }

  return null;
}

async function geocode(address: string): Promise<Point | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", address);
  url.searchParams.set("email", CONTACT);

  const res = await fetch(url, {
    headers: { "User-Agent": GEOCODE_AGENT, Accept: "application/json" },
    next: { revalidate: 86_400 },
  });
  if (!res.ok) return null;

  const found = (await res.json()) as { lat?: string; lon?: string }[];
  const first = found[0];
  if (!first?.lat || !first?.lon) return null;

  const lat = Number(first.lat);
  const lon = Number(first.lon);
  return Number.isFinite(lat) && Number.isFinite(lon)
    ? { lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)) }
    : null;
}

export async function resolveShareLink(link: string): Promise<ResolvedPlace | null> {
  let html: string;
  try {
    const res = await fetch(link, {
      redirect: "follow",
      headers: { "User-Agent": MOBILE_AGENT },
    });

    const direct = parseGoogleMapsLink(res.url);
    if (direct) return direct;

    html = await res.text();
  } catch (error) {
    LogError("[resolveShareLink] fetch", error);
    return null;
  }

  const placeUrl = placeUrlFromHtml(html);
  if (placeUrl) {
    const fromUrl = parseGoogleMapsLink(placeUrl);
    if (fromUrl) return fromUrl;
  }

  const address = placeAddressFromHtml(html);
  if (!address) return null;

  try {
    const point = await geocodeWithFallback(address);
    return point ? { ...point, address } : null;
  } catch (error) {
    LogError("[resolveShareLink] geocode", error);
    return null;
  }
}
