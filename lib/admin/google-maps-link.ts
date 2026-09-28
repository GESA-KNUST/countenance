export interface Point {
  lat: number;
  lon: number;
}

const SHORT_HOSTS = ["maps.app.goo.gl", "goo.gl", "g.co"];

const isLat = (value: number) => Number.isFinite(value) && value >= -90 && value <= 90;
const isLon = (value: number) => Number.isFinite(value) && value >= -180 && value <= 180;

const round = (value: number) => Number(value.toFixed(6));

const point = (lat: number, lon: number): Point | null =>
  isLat(lat) && isLon(lon) ? { lat: round(lat), lon: round(lon) } : null;

export function isShortGoogleMapsLink(input: string): boolean {
  try {
    const url = new URL(input.trim());
    return SHORT_HOSTS.includes(url.hostname.replace(/^www\./, ""));
  } catch {
    return false;
  }
}

const fromPair = (raw: string | null | undefined): Point | null => {
  if (!raw) return null;
  const cleaned = raw.replace(/^loc:/i, "").trim();
  const match = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return point(Number(match[1]), Number(match[2]));
};

export function parseGoogleMapsLink(input: string): Point | null {
  const text = input.trim();
  if (!text) return null;

  const direct = fromPair(text);
  if (direct) return direct;

  const placePin = text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (placePin) {
    const found = point(Number(placePin[1]), Number(placePin[2]));
    if (found) return found;
  }

  let url: URL | null = null;
  try {
    url = new URL(text);
  } catch {
    url = null;
  }

  if (url) {
    for (const key of ["query", "q", "destination", "center", "ll", "sll", "daddr"]) {
      const found = fromPair(url.searchParams.get(key));
      if (found) return found;
    }
  }

  const camera = text.match(/[/@](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,|\/|$|\?)/);
  if (camera) {
    const found = point(Number(camera[1]), Number(camera[2]));
    if (found) return found;
  }

  return null;
}
