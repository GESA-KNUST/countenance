import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Clubs & Societies",
    alternates: { canonical: "/clubs" },
    description: "Explore the diverse engineering clubs and student societies under GESA-KNUST. Join a community that shares your passion.",
    openGraph: {
        url: "/clubs",
        title: "Clubs & Societies | GESA-KNUST",
        description: "Find and join engineering clubs and societies at GESA-KNUST.",
    },
};

export default function ClubsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
