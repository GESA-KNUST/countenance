import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPersonalityBySlug, getPersonalityOfTheWeek, personalitySlug } from '@/lib/data/potw';
import { ogImage } from '@/lib/data/og-image';
import { extractText } from '@/lib/extractText';
import PersonalityProfile from '@/components/home/PersonalityProfile';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const items = (await getPersonalityOfTheWeek()) ?? [];
    return items.map((item) => ({ slug: personalitySlug(item) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const person = await getPersonalityBySlug(slug);
    if (!person) return { title: 'Personality not found' };

    const name = person.name ?? 'Personality of the week';
    const title = person.role ? `${name} | ${person.role}` : name;
    const description =
        extractText(person.description?.json).slice(0, 180) ||
        `${name} is the GESA-KNUST personality of the week.`;

    const share = ogImage(person.image?.url, name, 'face');

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'profile',
            images: share,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: share.map((image) => image.url),
        },
    };
}

const PersonalityPage = async ({ params }: Props) => {
    const { slug } = await params;
    const person = await getPersonalityBySlug(slug);
    if (!person) notFound();

    return <PersonalityProfile person={person} />;
};

export default PersonalityPage;
