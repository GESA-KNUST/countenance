'use client';

import HeroSection from '../home/HeroSection';
import { usePageHero } from '@/hooks/usePageHero';

const TeamHero = () => {
    const { hero } = usePageHero('team');

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
            images={hero.images}
            mobileImages={hero.mobileImages.length > 0 ? hero.mobileImages : undefined}
            button={false}
            overlayOpacity="bg-black/10"
        />
    );
};

export default TeamHero;
