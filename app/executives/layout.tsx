import { Metadata } from "next";

import { getPageHero, ogImageMetadata } from "@/lib/data/page-hero";

export async function generateMetadata(): Promise<Metadata> {
    const hero = await getPageHero("executives");
    const images = ogImageMetadata(hero, "GESA-KNUST executives");

    return {
        title: "Executives",
        description: "Meet the student leaders serving the Ghana Engineering Students Association at KNUST.",
        openGraph: {
            title: "Executives | GESA-KNUST",
            description: "Leadership team of GESA-KNUST.",
            images,
        },
        twitter: {
            card: "summary_large_image",
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
