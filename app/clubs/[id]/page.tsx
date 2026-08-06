import ClubDetail from '@/components/clubs/ClubDetail';
import { contentfulClient } from "@/lib/contentful-client";
import { gql } from "graphql-request";
import { ClubItems } from '@/hooks/useClubs';
import NotFoundCard from '@/components/common/NotFoundCard';
import { LogError } from '@/lib/logger';

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

const ClubDetailPage = async (props: Props) => {
    const params = await props.params;
    const { id } = params;
    let club: ClubItems | null = null;

    try {
        const data = await contentfulClient.request<ClubCollection>(GET_CLUB_BY_ID, { id });
        club = data.clubCollection.items[0];
    } catch (error) {
        LogError("Failed to fetch club detail", error);
    }

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
