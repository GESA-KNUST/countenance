import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { refreshSite } from "@/lib/admin/refresh";
import {
  MAX_IMAGES_PER_STRIP,
  assertPublishedAsset,
  isWriteConfigured,
  saveHeroEntry,
} from "@/lib/admin/contentful-write";
import { PAGE_HERO_FALLBACKS, type PageHeroKey } from "@/lib/data/page-hero";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

const VALID_KEYS = Object.keys(PAGE_HERO_FALLBACKS) as PageHeroKey[];

function readIds(value: unknown) {
  if (!Array.isArray(value)) return null;
  if (value.length > MAX_IMAGES_PER_STRIP) return null;
  if (!value.every((id) => typeof id === "string" && /^[a-zA-Z0-9._-]{1,64}$/.test(id))) return null;
  return value as string[];
}

export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json(
      { message: "Saving is not set up yet. Ask a developer to add the Contentful token." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const pageKey = body.pageKey;
  if (typeof pageKey !== "string" || !VALID_KEYS.includes(pageKey as PageHeroKey)) {
    return NextResponse.json({ message: "That page does not exist." }, { status: 400 });
  }

  const imageIds = readIds(body.imageIds);
  const mobileImageIds = readIds(body.mobileImageIds);
  if (!imageIds || !mobileImageIds) {
    return NextResponse.json(
      { message: `Please use between 1 and ${MAX_IMAGES_PER_STRIP} photos.` },
      { status: 400 }
    );
  }
  if (imageIds.length === 0) {
    return NextResponse.json(
      { message: "Keep at least one photo on the page." },
      { status: 400 }
    );
  }

  try {
    await Promise.all([...imageIds, ...mobileImageIds].map(assertPublishedAsset));
    await saveHeroEntry(pageKey, imageIds, mobileImageIds);
  } catch (error) {
    LogError("[/api/admin/hero]", pageKey, error);
    return NextResponse.json(
      { message: "Those photos could not be saved. Nothing was changed." },
      { status: 502 }
    );
  }
    refreshSite();

  return NextResponse.json({ ok: true });
}
