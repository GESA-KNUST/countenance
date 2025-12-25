import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Visual tour of GESA-KNUST activities, events, and memorable moments in the College of Engineering.",
    openGraph: {
        title: "Gallery | GESA-KNUST",
        description: "Photos and memories from GESA-KNUST events.",
    },
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
