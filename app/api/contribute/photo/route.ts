import { NextRequest, NextResponse } from "next/server";
import { isWriteConfigured } from "@/lib/admin/cma";
import { SUBMISSION_LIMITS, uploadSubmissionImage } from "@/lib/admin/submissions";
import { setWriterPhoto } from "@/lib/admin/author-identity";
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

  const limit = rateLimit(`writer-photo:${writer.email}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many changes for now. Please try again later." },
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
    return NextResponse.json({ message: "Please choose a photo." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ message: "Please use a JPG, PNG or WebP photo." }, { status: 400 });
  }
  if (file.size > SUBMISSION_LIMITS.imageBytes) {
    return NextResponse.json({ message: "That photo is too large." }, { status: 400 });
  }

  try {
    const asset = await uploadSubmissionImage(
      await file.arrayBuffer(),
      file.name || "profile.jpg",
      file.type
    );
    const url = await setWriterPhoto(writer.email, writer.name, asset.id);
    return NextResponse.json({ url: url ?? asset.url });
  } catch (error) {
    LogError("[/api/contribute/photo]", error);
    return NextResponse.json({ message: "That photo could not be saved." }, { status: 502 });
  }
}
