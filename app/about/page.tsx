import AboutHero from '@/components/about/AboutHero';

import TeamSection from '@/components/about/TeamSection';


export const metadata = {
    title: 'About The Team | GESA',
    description: 'Meet the development team behind the GESA platform.',
}

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <AboutHero />
            <TeamSection />
        </div>
    );
};

export default AboutPage;
