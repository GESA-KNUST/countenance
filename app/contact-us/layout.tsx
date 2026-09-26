import { Metadata } from "next";

import { getPageHero, ogImageMetadata } from "@/lib/data/page-hero";

export async function generateMetadata(): Promise<Metadata> {
    const hero = await getPageHero("contact-us");
    const images = ogImageMetadata(hero, "Contact GESA-KNUST");

    return {
        title: "Contact Us",
        description: "Get in touch with GESA-KNUST. We are here to answer your questions and collaborate.",
        openGraph: {
            title: "Contact Us | GESA-KNUST",
            description: "Reach out to the Ghana Engineering Students Association.",
            images,
        },
        twitter: {
            card: "summary_large_image",
            images: images.map((image) => image.url),
        },
    };
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
