import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isSignedIn } from "@/lib/admin/session";
import { isWriteConfigured } from "@/lib/admin/cma";
import { findCollection } from "@/lib/admin/collections";
import { setEntryOrder } from "@/lib/admin/entries";
import { CONTENTFUL_CACHE_TAG } from "@/lib/contentful-client";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json({ message: "Not set up yet." }, { status: 503 });
  }

  let body: { type?: unknown; ids?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type : "";
  if (!findCollection(type)) {
    return NextResponse.json({ message: "Unknown item type." }, { status: 400 });
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string" && /^[A-Za-z0-9._-]{1,64}$/.test(id))
    : null;
  if (!ids || ids.length === 0 || ids.length !== new Set(ids).size) {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  try {
    await setEntryOrder(type, ids);
    revalidateTag(CONTENTFUL_CACHE_TAG, "seconds");
    return NextResponse.json({ ok: true });
  } catch (error) {
    LogError("[/api/admin/reorder]", type, error);
    const message =
      error instanceof Error && error.message.startsWith("Some items")
        ? error.message
        : "The new order could not be saved.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
