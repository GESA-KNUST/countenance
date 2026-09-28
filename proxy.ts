import { NextRequest, NextResponse } from "next/server";

const ADMIN_HOSTS = (process.env.ADMIN_HOSTNAMES ?? "web-admin.gesaknust.com")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_PATHS = ["/admin", "/api/admin"];

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
  matcher: ["/admin/:path*", "/api/admin/:path*", "/blog-2"],
};
