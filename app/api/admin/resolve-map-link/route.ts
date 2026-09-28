import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { clientKey, rateLimit } from "@/lib/admin/rate-limit";
import { isShortGoogleMapsLink } from "@/lib/admin/google-maps-link";
import { resolveShareLink } from "@/lib/admin/google-maps-resolve";
import { LogError } from "@/lib/logger";

/**
 * A shared Google Maps link is shortened and carries no coordinates, so it has
 * to be followed to the full URL. A browser cannot read that redirect, so it
 * happens here.
 */
export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }

  const limit = rateLimit(clientKey(request, "resolve-map-link"), 30, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many links at once. Wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const link = typeof body.url === "string" ? body.url.trim() : "";
  if (!isShortGoogleMapsLink(link)) {
    return NextResponse.json({ message: "That is not a Google Maps share link." }, { status: 400 });
  }

  try {
    const place = await resolveShareLink(link);

    if (!place) {
      return NextResponse.json(
        {
          message:
            "That share link did not give a location. Open it in Google Maps, then copy the long link from the address bar.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(place);
  } catch (error) {
    LogError("[/api/admin/resolve-map-link]", error);
    return NextResponse.json(
      { message: "Could not open that link. Paste the long link from the address bar instead." },
      { status: 502 }
    );
  }
}
