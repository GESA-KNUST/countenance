import { NextRequest, NextResponse } from "next/server";
import { isWriteConfigured } from "@/lib/admin/cma";
import { createSubmission, readSubmission } from "@/lib/admin/submissions";
import { rateLimit } from "@/lib/admin/rate-limit";
import { currentWriter } from "@/lib/contribute/session";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!isWriteConfigured()) {
    return NextResponse.json(
      { message: "Submissions are not set up yet. Please try again later." },
      { status: 503 }
    );
  }

  const writer = await currentWriter();
  if (!writer) {
    return NextResponse.json(
      { message: "Please sign in with Google before sending your article." },
      { status: 401 }
    );
  }

  // The rate limit follows the person, not the connection, so one account
  // cannot flood the queue from several networks.
  const limit = rateLimit(`writer:${writer.email}`, 5, 60 * 60 * 1000);
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
      { message: "Please add a title, a short summary, a cover photo and the article." },
      { status: 400 }
    );
  }

  try {
    const result = await createSubmission(submission, writer);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    LogError("[/api/contribute]", error);
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
