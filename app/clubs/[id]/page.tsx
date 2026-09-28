import ClubDetail from '@/components/clubs/ClubDetail';
import { contentfulClient } from "@/lib/contentful-client";
import { gql } from "graphql-request";
import { ClubItems } from '@/hooks/useClubs';
import NotFoundCard from '@/components/common/NotFoundCard';
import { LogError } from '@/lib/logger';
import type { Metadata } from 'next';
import { ogImage } from '@/lib/data/og-image';

interface ClubCollection {
    clubCollection: {
        items: ClubItems[]
    }
}

const GET_CLUB_BY_ID = gql`
query ClubById($id: String!) {
  clubCollection(where: { sys: { id: $id } }, limit: 1) {
    items {
      sys {
        id
      }
      clubLink
      clubLogo {
        description
        url
        title
      }
      clubName
      clubType
      description
      isFeatured
      isActivelyRecruitingMembers
      aboutclub {
        json
        links {
          assets {
            block {
              sys {
                id
              }
              url
              title
              description
              width
              height
            }
          }
        }
      }
    }
  }
}
`;

type Props = {
    params: Promise<{ id: string }>
}

const fetchClub = async (id: string): Promise<ClubItems | null> => {
    try {
        const data = await contentfulClient.request<ClubCollection>(GET_CLUB_BY_ID, { id });
        return data.clubCollection.items[0] ?? null;
    } catch (error) {
        LogError("Failed to fetch club detail", error);
        return null;
    }
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const { id } = await props.params;
    const club = await fetchClub(id);
    if (!club) return { title: 'Club not found' };

    const title = club.clubName;
    const description = club.description ?? `${club.clubName} at GESA-KNUST.`;
    const share = ogImage(club.clubLogo?.url, club.clubLogo?.title || club.clubName, { contain: true });

    return {
        title,
        description,
        openGraph: { title, description, type: 'article', images: share },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: share.map((image) => image.url),
        },
    };
}

const ClubDetailPage = async (props: Props) => {
    const params = await props.params;
    const { id } = params;
    const club = await fetchClub(id);

    if (!club) {
        return (
            <NotFoundCard
                title="Club Not Found"
                message="The club you are looking for might have been moved or deleted. Experience something else!"
                backHref="/clubs"
                backText="Back to Clubs and Societies"
            />
        );
    }

    return <ClubDetail club={club} />;
};

export default ClubDetailPage;
