import TeamHero from '@/components/team/TeamHero';

import TeamSection from '@/components/team/TeamSection';

import type { Metadata } from 'next';
import { getPageHero, ogImageMetadata } from '@/lib/data/page-hero';

export async function generateMetadata(): Promise<Metadata> {
    const hero = await getPageHero('team');
    const images = ogImageMetadata(hero, 'GESA Development Team');

    return {
        title: 'The Team | GESA',
        description: 'Meet the development team behind the GESA platform.',
        openGraph: { images },
        twitter: {
            card: 'summary_large_image',
            images: images.map((image) => image.url),
        },
    };
}

const TeamPage = async () => {
    const hero = await getPageHero('team');

    return (
        <div className="min-h-screen bg-white">
            <TeamHero initial={hero} />
            <TeamSection />
        </div>
    );
};

export default TeamPage;
