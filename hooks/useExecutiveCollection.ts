'use client';
import { useFetchData } from './useFetchData';
import { contentfulClient } from '@/lib/contentful-client';
import { gql } from 'graphql-request';
import { EXECUTIVE_LIST_FIELDS, type Executive } from '@/lib/data/executive';

interface Props {
  executiveCollection: {
    items: Executive[];
  };
}

const GET_EXECUTIVES = gql`
  query ExecutiveCollection {
    executiveCollection(limit: 200, order: [order_ASC]) {
      items {
        ${EXECUTIVE_LIST_FIELDS}
      }
    }
  }
`;

export const useExecutiveCollection = () => {
  const { data, isLoading, error } = useFetchData<Props>({
    queryKey: 'executives',
    queryFn: () => contentfulClient.request(GET_EXECUTIVES),
  });

  return {
    executives: data?.executiveCollection.items ?? [],
    isLoading,
    error,
  };
};
