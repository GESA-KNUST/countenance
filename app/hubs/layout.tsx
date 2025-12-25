import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Innovation Hubs",
    description: "Discover the innovation hubs and incubation centers driving student creativity at KNUST College of Engineering.",
    openGraph: {
        title: "Innovation Hubs | GESA-KNUST",
        description: "Centers of innovation and excellence at KNUST.",
    },
};

export default function HubsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
