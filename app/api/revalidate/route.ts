import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENTFUL_CACHE_TAG } from "@/lib/contentful-client";
import { LogError } from "@/lib/logger";

const SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json({ message: "Not configured." }, { status: 503 });
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret") ??
    "";

  if (provided !== SECRET) {
    return NextResponse.json({ message: "Not allowed." }, { status: 401 });
  }

  try {
    revalidateTag(CONTENTFUL_CACHE_TAG, "seconds");
    return NextResponse.json({ ok: true, revalidated: CONTENTFUL_CACHE_TAG });
  } catch (error) {
    LogError("[/api/revalidate]", error);
    return NextResponse.json({ message: "Could not refresh." }, { status: 500 });
  }
}
