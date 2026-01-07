import React from 'react'
import HeroSection from '@/components/home/HeroSection'
import { contentfulClient } from '@/lib/contentful-client';
import { gql } from 'graphql-request';
import ClubsList from '@/components/clubs/ClubsList';
import { ClubItems } from '@/hooks/useClubs';

interface ClubCollection {
  clubCollection: {
    items: ClubItems[]
  }
}

const GET_CLUBS = gql`
query ClubCollection {
  clubCollection {
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
    }
  }
}
`;

const ClubsPage = async () => {
  let clubs: ClubItems[] = [];

  try {
    const data = await contentfulClient.request<ClubCollection>(GET_CLUBS);
    clubs = data.clubCollection.items;
  } catch (error) {
    console.error("Failed to fetch clubs", error);
  }

  return (
    <div className='font-poppins min-h-screen'>
      <HeroSection
        title="Explore Our Clubs and Societies"
        highlight="Clubs and Societies"
        text='Connect, learn, and grow with clubs and societies that support your passions, goals, and personal development.'
        images={['/images/clubs/clubs-1.jpeg', '/images/clubs/clubs-2.jpg', '/images/clubs/clubs-3.jpg']}
        button={false}
      />
      <ClubsList clubs={clubs} />
    </div>
  )
}

export default ClubsPage;