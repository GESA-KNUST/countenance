import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { isWriteConfigured, uploadAsset } from "@/lib/admin/contentful-write";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json(
      { message: "Uploads are not set up yet. Ask a developer to add the Contentful token." },
      { status: 503 }
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const candidate = form.get("file");
    if (candidate instanceof File) file = candidate;
  } catch {
    return NextResponse.json({ message: "That upload did not come through." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ message: "No photo was attached." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { message: "That file is not a photo. Use a JPG, PNG or WebP." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "That photo is too large. Try a smaller one." },
      { status: 413 }
    );
  }

  try {
    const asset = await uploadAsset(await file.arrayBuffer(), file.name, file.type);
    return NextResponse.json(asset);
  } catch (error) {
    LogError("[/api/admin/upload]", file.name, error);
    return NextResponse.json(
      { message: "That photo could not be uploaded. Please try again." },
      { status: 502 }
    );
  }
}
