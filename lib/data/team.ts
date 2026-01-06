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
    about?: string;
}

export const teamMembers: TeamMember[] = [
    {
        name: "Professor Carl Danso Kwarteng",
        role: "Team Lead",
        year: "4th Year",
        major: "Electrical Engineering",
        description: "As the Team Lead, Professor Carl Danso Kwarteng provided strategic guidance and leadership to the GESA Software Engineering Team. His expertise and vision were crucial in steering the team towards success and innovation.",
        image: "/images/Prof.jpg",
        funFact: "Real life RIchard Hendricks.",
        socials: {
            linkedin: "https://www.linkedin.com/in/carl-danso-304663258/",
            github: "https://github.com/ProfCarl"
        },
        slug: "carl-danso-kwarteng",
        about: "As the **Team Lead**, Professor Carl Danso Kwarteng played a pivotal role in the GESA Software Engineering Team. Currently in his 4th year offering Electrical Engineering, he brought leadership and technical insight to the project, ensuring that our initiatives aligned with the broader goals of the association and effectively serve the student body."
    },
    {
        name: "Prince Asiedu",
        role: "Project Manager",
        year: "4th Year",
        major: "Agricultural Engineering",
        description: "Led the vision and execution of the GESA platform, ensuring milestones were met and the team remained cohesive. His leadership was pivotal in bridging the gap between technical execution and stakeholder requirements.",
        image: "/images/Prince.jpg",
        funFact: "Can coordinate a project timeline in his sleep.",
        socials: {
            linkedin: "https://www.linkedin.com/in/princek-asiedu/",
            github: "https://github.com/Asiedu13"
        },
        slug: "prince-asiedu",
        about: "As the **Project Manager**, Prince has been instrumental in the GESA Software Engineering Team. With a robust background in software engineering and technology, and currently in 4th year pursuing Agricultural Engineering, he brings a unique perspective to the project, ensuring that our solutions are not just technically sound but also relevant to the students we serve."
    },
    {
        name: "Obrempong Kwabena Osei-Wusu",
        role: "Lead Developer",
        year: "3rd Year",
        major: "Geomatic Engineering",
        description: "As a Lead Developer together with Joy, Obrempong was a driving force behind the entire GESA platform. He seamlessly bridged the gap between backend architecture and frontend elegance, implementing both the secure core infrastructure and the stunning, interactive user interfaces. His full-stack expertise ensured a performant, pixel-perfect experience from the database to the screen.",
        image: "/images/Obrempong.jpg",
        funFact: "A young daring Ghanaian, totally out of his comfort zone living his epic vision for Africa and Ghana, with hunger in his bones.",
        socials: {
            github: "https://github.com/Obrempong-1",
            linkedin: "https://www.linkedin.com/in/obrempong-kwabena-osei-wusu-7b0217257/"
        },
        slug: "obrempong-kwabena-osei-wusu",
        about: "As the **Lead Developer alongside Joy**, Obrempong has been instrumental in the GESA Software Engineering Team. With a strong background in software engineering and technology, and currently in his third year pursuing Geomatic Engineering, he aims to merge technology with the construction industry, particularly surveying, by integrating geospatial tools, data analytics, and modern digital solutions to improve accuracy, efficiency, and decision-making in construction projects, working closely with his sister, **Architect Abigail Nana Akua Osei-Wusu** and  his mentor **Surv.Hubert Owusu Boateng**. In his role as Lead Developer, he brings this interdisciplinary perspective to the GESA Web Application project, ensuring that the team’s solutions are not only technically sound but also practical, innovative, and aligned with the needs of the students they serve."
    },
    {
        name: "Adu Joy Atakora",
        role: "Lead Developer",
        year: "3rd Year",
        major: "Telecom Engineering",
        description: "As a Lead Developer together with Obrempong, Joy played a critical role in bringing the GESA vision to life. He expertly handled both the creative frontend implementation and robust backend logic, crafting fluid animations and responsive layouts while ensuring system stability. His versatile skills delivered a cohesive, polished, and dynamic application.",
        image: "/images/Joy.jpg",
        funFact: "Real life Betram Gilfoyle.",
        socials: {
            github: "https://github.com/Joylinton04",
            linkedin: "https://www.linkedin.com/in/joy-adu989/"
        },
        slug: "adu-joy-atakora",
        about: "As the **Lead Developer together with Obrempong**, Joy has been instrumental in the GESA Software Engineering Team. With a robust background in software engineering and technology, and currently in 3rd year pursuing Telecom Engineering, he brings a unique perspective to the project, ensuring that our solutions are not just technically sound but also relevant to the students we serve."
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
            github: "https://github.com/Logical883",
            linkedin: "https://www.linkedin.com/in/agyapong-albert-yeboah/"
        },
        slug: "albert-yeboah",
        about: "As the **UI Designer**, Albert has been instrumental in the GESA Digital Team. With a robust background in software engineering and technology, and currently in 3rd year pursuing Computer Engineering, he brings a unique perspective to the project, ensuring that our solutions are not just technically sound but also relevant to the students we serve."
    }
];
