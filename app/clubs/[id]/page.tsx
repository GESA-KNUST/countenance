import ClubDetail from '@/components/clubs/ClubDetail';
import { contentfulClient } from "@/lib/contentful-client";
import { gql } from "graphql-request";
import { ClubItems } from '@/hooks/useClubs';

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
        console.error("Failed to fetch club detail", error);
    }

    if (!club) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 font-header">Club Not Found</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">The club you are looking for might have been moved or deleted. Experience something else!</p>
                    <a href="/clubs" className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-[1.02]">
                        Back to Clubs and Societies
                    </a>
                </div>
            </div>
        );
    }

    return <ClubDetail club={club} />;
};

export default ClubDetailPage;
