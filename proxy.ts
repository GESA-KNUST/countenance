import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOSTS = (process.env.ADMIN_HOSTNAMES ?? "web-admin.gesaknust.com")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_PATHS = ["/admin", "/api/admin"];

const ENTRY_ID = /^[A-Za-z0-9]{20,24}$/;


const RENAMED_POSTS: Record<string, string> = {
  "you-are-not-finished-yet-nietzsches-idea-of-the-overman":
    "not-finished-yet-nietzsches-idea-overman",
};

function tidySlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2018\u2019\u201c\u201d]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isLocal(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  );
}

function isAdminHost(hostname: string) {
  if (isLocal(hostname)) return true;
  if (ADMIN_HOSTS.includes(hostname)) return true;

  return process.env.VERCEL_ENV !== "production" && hostname.endsWith(".vercel.app");
}

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/blog/")) {
    const raw = decodeURIComponent(pathname.slice("/blog/".length));

    if (raw) {
      const tidy = tidySlug(raw);
      const renamed = RENAMED_POSTS[tidy];
      const target = renamed ?? (tidy && tidy !== raw ? tidy : null);

      if (target && target !== raw) {
        return NextResponse.redirect(new URL(`/blog/${target}`, request.nextUrl), 308);
      }
    }
  }

  for (const section of ["departments", "faculties"]) {
    const prefix = `/${section}/`;
    if (!pathname.startsWith(prefix)) continue;

    const raw = decodeURIComponent(pathname.slice(prefix.length));
    if (raw && ENTRY_ID.test(raw)) {
      const target = new URL(`/${section === "departments" ? "department" : "faculty"}`, request.nextUrl);
      return NextResponse.redirect(target, 308);
    }
  }

  if (pathname === "/blog-2") {
    const slug = request.nextUrl.searchParams.get("slug");
    const target = new URL(slug ? `/blog/${encodeURIComponent(slug)}` : "/blog", request.nextUrl);
    return NextResponse.redirect(target, 308);
  }

  if (isAdminPath(pathname) && !isAdminHost(hostname)) {
    if (pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ message: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    return NextResponse.rewrite(new URL("/not-found-admin", request.url), {
      status: 404,
    });
  }

  const response = NextResponse.next();

  if (isAdminPath(pathname)) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set(
      "Content-Security-Policy",
      "frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    );
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/blog-2",
    "/blog/:slug",
    "/departments/:slug",
    "/faculties/:slug",
  ],
};
