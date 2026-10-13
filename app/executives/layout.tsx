import { Metadata } from "next";

import { getPageHero, ogImageMetadata } from "@/lib/data/page-hero";
import { currentAcademicYear, executivesForYear, getExecutives } from "@/lib/data/executive";

function leadershipSummary(executives: { fullName: string; executivePositionHeld: string }[]) {
    return executives
        .slice(0, 3)
        .map((executive) => `${executive.executivePositionHeld} ${executive.fullName}`)
        .join(", ");
}

export async function generateMetadata(): Promise<Metadata> {
    const [hero, executives] = await Promise.all([getPageHero("executives"), getExecutives()]);
    const images = ogImageMetadata(hero, "GESA-KNUST executives");

    const year = currentAcademicYear(executives);
    const serving = executivesForYear(executives, year);
    const summary = leadershipSummary(serving);

    const title = year ? `Current Executives (${year})` : "Executives";
    const description = year
        ? `The executives serving the Ghana Engineering Students Association at KNUST for the ${year} academic year${summary ? `: ${summary}` : ""}.`
        : "Meet the student leaders serving the Ghana Engineering Students Association at KNUST.";

    return {
        title,
        description,
        alternates: { canonical: "/executives" },
        openGraph: {
            title: `${title} | GESA-KNUST`,
            description,
            url: "/executives",
            images,
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | GESA-KNUST`,
            description,
            images: images.map((image) => image.url),
        },
    };
}

export default function ExecutivesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
