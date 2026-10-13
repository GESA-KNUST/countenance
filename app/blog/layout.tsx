import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog & News",
    alternates: { canonical: "/blog" },
    description:
        "Read the latest stories, achievements, and technical articles from engineering students and faculty at KNUST.",
    openGraph: {
        url: "/blog",
        title: "Blog & News | GESA-KNUST",
        description: "Insights and stories from the KNUST engineering community.",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
