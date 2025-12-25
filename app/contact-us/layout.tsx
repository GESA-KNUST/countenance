import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with GESA-KNUST. We are here to answer your questions and collaborate.",
    openGraph: {
        title: "Contact Us | GESA-KNUST",
        description: "Reach out to the Ghana Engineering Students Association.",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
