import { NextRequest, NextResponse } from "next/server";
import { CONTENTFUL_CACHE_TAG } from "@/lib/contentful-client";
import { refreshSite } from "@/lib/admin/refresh";
import { LogError } from "@/lib/logger";
import { executiveSlug, getExecutives, hasProfile } from "@/lib/data/executive";
import { getBlogsSafe } from "@/lib/data/blog";
import { getEventsSafe } from "@/lib/data/event";
import { blogHref } from "@/lib/data/blog-link";
import { pingIndexNow } from "@/lib/seo/indexnow";

const SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

async function changedUrls(type: string | undefined): Promise<string[]> {
  if (type === "executive") {
    const executives = await getExecutives();
    return [
      "/",
      "/executives",
      ...executives.filter(hasProfile).map((executive) => `/executives/${executiveSlug(executive)}`),
    ];
  }

  if (type === "blogPost") {
    const posts = await getBlogsSafe();
    return [
      "/",
      "/blog",
      ...posts.map((post) => blogHref(post.slug)).filter((href): href is string => Boolean(href)),
    ];
  }

  if (type === "eventCard") {
    const events = await getEventsSafe();
    return [
      "/",
      "/events",
      ...events
        .filter((event) => Boolean(event.slug))
        .map((event) => `/events/${encodeURIComponent(event.slug)}`),
    ];
  }

  if (type === "hub" || type === "announcements") return ["/", "/hubs"];
  if (type === "club") return ["/", "/clubs"];
  if (type === "galleryGroup" || type === "galleryImage") return ["/", "/gallery"];
  if (type === "department") return ["/department"];
  if (type === "faculty") return ["/faculty"];
  if (type === "personalityOfTheWeek") return ["/"];

  return [];
}

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

    let pinged = false;
    try {
      pinged = await pingIndexNow(await changedUrls(type));
    } catch (error) {
      LogError("[/api/revalidate] ping failed", error);
    }

    return NextResponse.json({
      ok: true,
      revalidated: CONTENTFUL_CACHE_TAG,
      type: type ?? null,
      pinged,
    });
  } catch (error) {
    LogError("[/api/revalidate]", error);
    return NextResponse.json({ message: "Could not refresh." }, { status: 500 });
  }
}
