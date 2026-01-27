import TeamHero from '@/components/team/TeamHero';

import TeamSection from '@/components/team/TeamSection';


export const metadata = {
    title: 'The Team | GESA',
    description: 'Meet the development team behind the GESA platform.',
    openGraph: {
        images: [
            {
                url: '/images/Team/Team-1.png',
                width: 1626,
                height: 1080,
                alt: 'GESA Development Team',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/Team/Team-1.png'],
    },
}

const TeamPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <TeamHero />
            <TeamSection />
        </div>
    );
};

export default TeamPage;
