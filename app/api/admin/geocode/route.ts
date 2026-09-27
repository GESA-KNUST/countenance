import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { clientKey, rateLimit } from "@/lib/admin/rate-limit";
import { LogError } from "@/lib/logger";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

const CONTACT = process.env.GEOCODE_CONTACT_EMAIL ?? "info@gesaknust.com";
const USER_AGENT = `gesaknust.com admin location picker (${CONTACT})`;

interface NominatimPlace {
  display_name?: string;
  lat?: string;
  lon?: string;
}

export async function GET(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }

  const term = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (term.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const limit = rateLimit(clientKey(request, "geocode"), 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many searches. Wait a moment and try again." },
      { status: 429 }
    );
  }

  const url = new URL(NOMINATIM);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "6");
  url.searchParams.set("q", term);
  url.searchParams.set("email", CONTACT);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      next: { revalidate: 86_400 },
    });

    if (!res.ok) {
      LogError("[/api/admin/geocode] upstream", res.status);
      return NextResponse.json(
        { message: "Place search is unavailable. Tap the map to place the pin instead." },
        { status: 502 }
      );
    }

    const found = (await res.json()) as NominatimPlace[];
    const results = found
      .filter((item) => item.display_name && item.lat && item.lon)
      .map((item) => ({
        label: item.display_name as string,
        lat: Number(item.lat),
        lon: Number(item.lon),
      }))
      .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lon));

    return NextResponse.json({ results });
  } catch (error) {
    LogError("[/api/admin/geocode]", error);
    return NextResponse.json(
      { message: "Place search is unavailable. Tap the map to place the pin instead." },
      { status: 502 }
    );
  }
}
