'use client';

import React from 'react';
import HeroSection from '../home/HeroSection';

const AboutHero = () => {
    return (
        <HeroSection
            title="BEHIND THE GESA WEB APPLICATION"
            highlight="WEB APPLICATION"
            text="A dedicated team of engineering students united by a passion for technology and a commitment to the GESA community."
            images={['/images/img1.png', '/images/img2.png',]}
            button={false}
        />
    );
};

export default AboutHero;
