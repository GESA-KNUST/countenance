import { NextRequest, NextResponse } from "next/server";
import { isWriteConfigured } from "@/lib/admin/cma";
import { SUBMISSION_LIMITS, uploadSubmissionImage } from "@/lib/admin/submissions";
import { rateLimit } from "@/lib/admin/rate-limit";
import { currentWriter } from "@/lib/contribute/session";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  if (!isWriteConfigured()) {
    return NextResponse.json({ message: "Not available right now." }, { status: 503 });
  }

  const writer = await currentWriter();
  if (!writer) {
    return NextResponse.json({ message: "Please sign in first." }, { status: 401 });
  }

  const limit = rateLimit(`writer-upload:${writer.email}`, 20, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many photos for now. Please try again later." },
      { status: 429 }
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
  if (file.size > SUBMISSION_LIMITS.imageBytes) {
    return NextResponse.json(
      { message: "That photo is too large. Try a smaller one." },
      { status: 413 }
    );
  }

  try {
    const asset = await uploadSubmissionImage(await file.arrayBuffer(), file.name, file.type);
    return NextResponse.json(asset);
  } catch (error) {
    LogError("[/api/contribute/upload]", file.name, error);
    return NextResponse.json(
      { message: "That photo could not be added. Please try again." },
      { status: 502 }
    );
  }
}
