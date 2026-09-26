import { Metadata } from "next";

import { getPageHero, ogImageMetadata } from "@/lib/data/page-hero";

export async function generateMetadata(): Promise<Metadata> {
    const hero = await getPageHero("gallery");
    const images = ogImageMetadata(hero, "GESA-KNUST gallery");

    return {
        title: "Gallery",
        description: "Visual tour of GESA-KNUST activities, events, and memorable moments in the College of Engineering.",
        openGraph: {
            title: "Gallery | GESA-KNUST",
            description: "Photos and memories from GESA-KNUST events.",
            images,
        },
        twitter: {
            card: "summary_large_image",
            images: images.map((image) => image.url),
        },
    };
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
