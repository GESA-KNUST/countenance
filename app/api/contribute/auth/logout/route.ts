import { NextRequest, NextResponse } from "next/server";
import { WRITER_COOKIE } from "@/lib/contribute/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/contribute", request.nextUrl.origin), 303);
  response.cookies.delete(WRITER_COOKIE);
  return response;
}
