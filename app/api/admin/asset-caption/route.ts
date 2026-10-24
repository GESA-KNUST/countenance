import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { isWriteConfigured } from "@/lib/admin/cma";
import { readAssetCaption, saveAssetCaption } from "@/lib/admin/assets";
import { refreshSite } from "@/lib/admin/refresh";
import { LogError } from "@/lib/logger";

const ASSET_ID = /^[A-Za-z0-9._-]{1,64}$/;
const MAX_NAME = 120;
const MAX_CAPTION = 300;

async function guard() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json({ message: "Not set up yet." }, { status: 503 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!ASSET_ID.test(id)) {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  try {
    const caption = await readAssetCaption(id);
    if (!caption) return NextResponse.json({ message: "That photo was not found." }, { status: 404 });
    return NextResponse.json(caption);
  } catch (error) {
    LogError("[/api/admin/asset-caption GET]", id, error);
    return NextResponse.json({ message: "That photo could not be read." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await guard();
  if (denied) return denied;

  let body: { id?: unknown; name?: unknown; caption?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const caption = typeof body.caption === "string" ? body.caption.trim() : "";
  if (typeof body.id !== "string" || !ASSET_ID.test(body.id) || name.length > MAX_NAME || caption.length > MAX_CAPTION) {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  try {
    await saveAssetCaption(body.id, { name, caption });
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    LogError("[/api/admin/asset-caption POST]", body.id, error);
    return NextResponse.json({ message: "That caption could not be saved." }, { status: 502 });
  }
}
