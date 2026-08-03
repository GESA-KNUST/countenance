import { NextRequest, NextResponse } from "next/server";
import { contentfulDirect, CONTENTFUL_REVALIDATE_SECONDS } from "@/lib/contentful-client";
import { LogError } from "@/lib/logger";

interface ContentfulProxyBody {
    query: string;
    variables?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
    let body: ContentfulProxyBody;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    if (!body?.query || typeof body.query !== "string") {
        return NextResponse.json({ message: "Missing GraphQL query" }, { status: 400 });
    }

    try {
        const data = await contentfulDirect.request(body.query, body.variables);
        return NextResponse.json(data, {
            headers: {
                "Cache-Control": `public, s-maxage=${CONTENTFUL_REVALIDATE_SECONDS}, stale-while-revalidate`,
            },
        });
    } catch (error) {
        LogError("[/api/contentful] request failed", error);
        return NextResponse.json(
            { message: "Failed to fetch content" },
            { status: 502 }
        );
    }
}
