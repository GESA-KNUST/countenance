import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Executives",
    description: "Meet the student leaders serving the Ghana Engineering Students Association at KNUST.",
    openGraph: {
        title: "Executives | GESA-KNUST",
        description: "Leadership team of GESA-KNUST.",
    },
};

export default function ExecutivesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
