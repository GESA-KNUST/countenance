import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/session";
import { refreshSite } from "@/lib/admin/refresh";
import { isWriteConfigured } from "@/lib/admin/cma";
import { findCollection } from "@/lib/admin/collections";
import { saveEntry, type FieldValue } from "@/lib/admin/entries";
import { LogError } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }
  if (!isWriteConfigured()) {
    return NextResponse.json(
      { message: "Saving is not set up yet. Ask a developer to add the Contentful token." },
      { status: 503 }
    );
  }

  let body: {
    type?: unknown;
    id?: unknown;
    values?: unknown;
    lockedFields?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type : "";
  if (!(await findCollection(type))) {
    return NextResponse.json({ message: "Unknown item type." }, { status: 400 });
  }

  const id =
    typeof body.id === "string" && /^[A-Za-z0-9._-]{1,64}$/.test(body.id) ? body.id : null;
  if (typeof body.values !== "object" || body.values === null) {
    return NextResponse.json({ message: "Nothing to save." }, { status: 400 });
  }

  const lockedFields = Array.isArray(body.lockedFields)
    ? body.lockedFields.filter((value): value is string => typeof value === "string")
    : [];

  try {
    const result = await saveEntry(
      type,
      id,
      body.values as Record<string, FieldValue>,
      lockedFields
    );
    refreshSite(type);
    return NextResponse.json(result);
  } catch (error) {
    LogError("[/api/admin/entry]", type, id, error);
    const message =
      error instanceof Error && error.message.startsWith("Please fill in")
        ? error.message
        : "That could not be saved. Please check the fields and try again.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
