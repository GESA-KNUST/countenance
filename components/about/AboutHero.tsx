'use client';

import DepartmentHero from '../department/DepartmentHero';

const AboutHero = () => {
    return (
        <DepartmentHero
            title="Meet the Minds"
            subtitle="Behind the Platform"
            text="A dedicated team of engineering students united by a passion for technology and a commitment to the GESA community."
            images={['/images/img1.png', '/images/img2.png']}
        />
    );
};

export default AboutHero;
