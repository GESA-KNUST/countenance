import { teamMembers } from '@/lib/data/team';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import TeamMemberClient from './TeamMemberClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const member = teamMembers.find((m) => m.slug === slug);

    if (!member) {
        return {
            title: 'Member Not Found | GESA Team',
        };
    }

    const domain = 'https://www.gesaknust.com';
    const imageUrl = member.image ? `${domain}${member.image}?v=1` : `${domain}/images/logo.png?v=1`;

    return {
        title: `${member.name} | ${member.role}`,
        description: member.description,
        openGraph: {
            title: `${member.name} | ${member.role}`,
            description: member.description,
            siteName: 'GESA-KNUST',
            locale: 'en_GH',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: member.name,
                },
            ],
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${member.name} | ${member.role}`,
            description: member.description,
            images: [imageUrl],
        },
    };
}

const TeamMemberPage = async ({ params }: Props) => {
    const { slug } = await params;
    const member = teamMembers.find((m) => m.slug === slug);

    if (!member) {
        notFound();
    }

    return <TeamMemberClient member={member} />;
};

export default TeamMemberPage;
