import type { Metadata } from 'next';
import Container from '@/components/custom/Container';
import { PRIVACY_UPDATED, privacySections } from '@/lib/data/privacy';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How GESA-KNUST collects, uses and protects your information on gesaknust.com and the GESA Opportunities Hub.',
    alternates: { canonical: '/privacy' },
    openGraph: {
        url: '/privacy',
        title: 'Privacy Policy',
        description: 'How GESA-KNUST collects, uses and protects your information.',
    },
};

const PrivacyPage = () => (
    <div className="font-poppins bg-white">
        <Container size="lg">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-header text-4xl font-bold leading-[1.05] tracking-tight text-[#252638] sm:text-5xl">
                    Privacy Policy
                </h1>
                <p className="mt-4 text-base text-gray-500">Last updated {PRIVACY_UPDATED}</p>

                <div className="mt-10 space-y-10 border-t border-gray-100 pt-10">
                    {privacySections.map((section) => (
                        <section key={section.heading} className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#252638]">{section.heading}</h2>
                            {section.items && (
                                <ul className="list-disc space-y-2 pl-5 leading-relaxed text-gray-600">
                                    {section.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            {section.paragraphs?.map((paragraph) => (
                                <p key={paragraph} className="leading-relaxed text-gray-600">
                                    {paragraph}
                                </p>
                            ))}
                        </section>
                    ))}
                </div>
            </div>
        </Container>
    </div>
);

export default PrivacyPage;
