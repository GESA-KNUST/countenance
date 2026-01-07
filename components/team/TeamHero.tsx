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
            images={['/images/img1.png', '/images/img2.png',]}
            button={false}
        />
    );
};

export default TeamHero;
