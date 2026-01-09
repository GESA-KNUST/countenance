'use client';

import HeroSection from '../home/HeroSection';

const TeamHero = () => {
    return (
        <HeroSection
            title="Behind The GESA "
            highlight="Web Application"
            text={
                <span>
                    A dedicated team of engineering students united by a passion for technology and a commitment to the GESA community.{" "}
                    <span className="text-yellow-500 font-bold">Built for engineers by engineers.</span>
                </span>
            }
            images={['/images/Team/Team-1.png', '/images/Team/Team-2.png', '/images/Team/Team-3.png', '/images/Team/Team-4.png', '/images/Team/Team-5.png']}
            button={false}
            overlayOpacity="bg-black/10"
        />
    );
};

export default TeamHero;
