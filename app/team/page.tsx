import TeamHero from '@/components/team/TeamHero';

import TeamSection from '@/components/team/TeamSection';


export const metadata = {
    title: 'The Team | GESA',
    description: 'Meet the development team behind the GESA platform.',
    openGraph: {
        images: [
            {
                url: '/images/Team/teammobile1.png',
                width: 1200,
                height: 630,
                alt: 'GESA Development Team',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/Team/teammobile1.png'],
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
