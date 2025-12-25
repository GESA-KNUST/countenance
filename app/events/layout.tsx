import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events",
    description: "Stay updated with upcoming engineering events, workshops, hackathons, and seminars at KNUST College of Engineering.",
    openGraph: {
        title: "Events | GESA-KNUST",
        description: "Discover the latest engineering events and activities at KNUST.",
    },
};

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
