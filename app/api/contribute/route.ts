import { NextRequest, NextResponse } from "next/server";
import { isWriteConfigured } from "@/lib/admin/cma";
import { createSubmission, readSubmission } from "@/lib/admin/submissions";
import { clientKey, rateLimit } from "@/lib/admin/rate-limit";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!isWriteConfigured()) {
    return NextResponse.json(
      { message: "Submissions are not set up yet. Please try again later." },
      { status: 503 }
    );
  }

  const limit = rateLimit(clientKey(request, "contribute"), 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "You have sent a few already. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const submission = readSubmission(body);
  if (!submission) {
    return NextResponse.json(
      { message: "Please add your name, a title, a short summary, a cover photo and the article." },
      { status: 400 }
    );
  }

  try {
    const result = await createSubmission(submission);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    LogError("[/api/contribute]", error);
    if (error instanceof Error && error.message === "author does not exist") {
      return NextResponse.json(
        { message: "That writer could not be found. Please pick again." },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message === "cover image does not exist") {
      return NextResponse.json(
        { message: "That cover photo could not be found. Please add it again." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Your article could not be sent. Please try again." },
      { status: 502 }
    );
  }
}
