import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { refreshSite } from "@/lib/admin/refresh";
import { isWriteConfigured } from "@/lib/admin/cma";
import { approveSubmission, rejectSubmission } from "@/lib/admin/submissions";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json({ message: "Not set up yet." }, { status: 503 });
  }

  let body: { id?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action;
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(id) || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  try {
    if (action === "approve") await approveSubmission(id);
    else await rejectSubmission(id);
    refreshSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    LogError("[/api/admin/submission]", action, id, error);
    const message =
      error instanceof Error &&
      (error.message.startsWith("Choose an author") || error.message.startsWith("Please fix this"))
        ? error.message
        : "That could not be done. Please try again.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
