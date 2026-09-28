import { NextRequest, NextResponse } from "next/server";
import { CONTENTFUL_CACHE_TAG } from "@/lib/contentful-client";
import { refreshSite } from "@/lib/admin/refresh";
import { LogError } from "@/lib/logger";

const SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json({ message: "Not configured." }, { status: 503 });
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.nextUrl.searchParams.get("secret") ??
    "";

  if (provided !== SECRET) {
    return NextResponse.json({ message: "Not allowed." }, { status: 401 });
  }

  let type: string | undefined;
  try {
    const body = (await request.json()) as {
      sys?: { contentType?: { sys?: { id?: string } } };
    };
    type = body?.sys?.contentType?.sys?.id;
  } catch {
    type = undefined;
  }

  try {
    refreshSite(type);
    return NextResponse.json({ ok: true, revalidated: CONTENTFUL_CACHE_TAG, type: type ?? null });
  } catch (error) {
    LogError("[/api/revalidate]", error);
    return NextResponse.json({ message: "Could not refresh." }, { status: 500 });
  }
}
