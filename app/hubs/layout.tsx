import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Opportunities Hub",
    description: "Explore opportunities including internships, scholarships, and financial aid available to GESA students.",
    openGraph: {
        title: "Opportunities Hub | GESA-KNUST",
        description: "Find career and academic opportunities at GESA-KNUST.",
    },
};

export default function HubsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
