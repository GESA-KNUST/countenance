export interface TeamMember {
    name: string;
    role: string;
    description: string;
    image: string | null;
    socials?: {
        github?: string;
        linkedin?: string;
    };
    funFact?: string;
    year: string;
    major: string;
    slug: string;
}

export const teamMembers: TeamMember[] = [
    {
        name: "Prince Asiedu",
        role: "Project Manager",
        year: "4th Year",
        major: "Agricultural Engineering",
        description: "Led the vision and execution of the GESA platform, ensuring milestones were met and the team remained cohesive. His leadership was pivotal in bridging the gap between technical execution and stakeholder requirements.",
        image: "/images/Prince.jpg",
        funFact: "Can coordinate a project timeline in his sleep.",
        socials: {
            linkedin: "https://linkedin.com",
            github: "https://github.com"
        },
        slug: "prince-asiedu"
    },
    {
        name: "Obrempong Kwabena Osei-Wusu",
        role: "Lead Developer",
        year: "3rd Year",
        major: "Geomatic Engineering",
        description: "As a Lead Developer, Obrempong was a driving force behind the entire GESA platform. He seamlessly bridged the gap between backend architecture and frontend elegance, implementing both the secure core infrastructure and the stunning, interactive user interfaces. His full-stack expertise ensured a performant, pixel-perfect experience from the database to the screen.",
        image: "/images/Obrempong.jpg",
        funFact: "A young daring Ghanaian, totally out of his comfort zone living his epic vision for Africa and Ghana, with hunger in his bones.",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com"
        },
        slug: "obrempong-kwabena-osei-wusu"
    },
    {
        name: "Joy Atakora Adu",
        role: "Lead Developer",
        year: "3rd Year",
        major: "Telecom Engineering",
        description: "As a Lead Developer, Joy played a critical role in bringing the GESA vision to life. He expertly handled both the creative frontend implementation and robust backend logic, crafting fluid animations and responsive layouts while ensuring system stability. His versatile skills delivered a cohesive, polished, and dynamic application.",
        image: "/images/Joy.jpg",
        funFact: "Real life Betram Gilfoyle.",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com"
        },
        slug: "joy-adu-atakora"
    },
    {
        name: "Albert Agyapong Yeboah (Logical)",
        role: "UI Designer",
        year: "3rd Year",
        major: "Computer Engineering",
        description: "A creative powerhouse with a deep background in graphics design, Logical brought the GESA platform to life through his expert use of Figma. He meticulously crafted the web interfaces, establishing the premium visual identity that balances aesthetic appeal with intuitive user experience.",
        image: "/images/Logical.jpg",
        funFact: "Sees the world in hex codes.",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com"
        },
        slug: "albert-yeboah"
    }
];
