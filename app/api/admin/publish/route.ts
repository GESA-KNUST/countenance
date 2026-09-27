import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isSignedIn } from "@/lib/admin/session";
import { isWriteConfigured } from "@/lib/admin/cma";
import { setEntryPublished } from "@/lib/admin/entries";
import { CONTENTFUL_CACHE_TAG } from "@/lib/contentful-client";
import { LogError } from "@/lib/logger";

export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json({ message: "Not set up yet." }, { status: 503 });
  }

  let body: { id?: unknown; published?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  if (
    typeof body.id !== "string" ||
    !/^[A-Za-z0-9._-]{1,64}$/.test(body.id) ||
    typeof body.published !== "boolean"
  ) {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  try {
    await setEntryPublished(body.id, body.published);
    revalidateTag(CONTENTFUL_CACHE_TAG, "seconds");
    return NextResponse.json({ ok: true });
  } catch (error) {
    LogError("[/api/admin/publish]", body.id, error);
    return NextResponse.json({ message: "That could not be changed." }, { status: 502 });
  }
}
