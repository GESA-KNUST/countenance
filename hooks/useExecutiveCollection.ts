"use client";
import { useFetchData } from './useFetchData';
import { contentfulClient } from '@/lib/contentful-client';
import { gql } from 'graphql-request';

interface ItemsProps {
  _id: string;
  academicYear: string;
  executivePositionHeld: string;
  fullName: string;
  officialImage: {
    title: string;
    description: string;
    url: string;
  };
}


interface Props {
  executiveCollection: {
    items: ItemsProps[];
  };
}

const GET_EXECUTIVES = gql`
  query ExecutiveCollection {
    executiveCollection {
      items {
        _id
        academicYear
        executivePositionHeld
        fullName
        officialImage {
          title
          description
          url
        }
      }
    }
  }
`;

export const useExecutiveCollection = () => {
  const { data, isLoading } = useFetchData<Props>({
    queryKey: 'executives',
    queryFn: () => contentfulClient.request(GET_EXECUTIVES),
  });

  return {
    executives: data?.executiveCollection.items ?? [],
    isLoading,
  };
};
