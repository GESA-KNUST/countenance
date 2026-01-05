import TeamHero from '@/components/team/TeamHero';

import TeamSection from '@/components/team/TeamSection';


export const metadata = {
    title: 'The Team | GESA',
    description: 'Meet the development team behind the GESA platform.',
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
