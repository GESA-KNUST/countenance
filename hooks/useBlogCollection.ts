import { useFetchData } from './useFetchData';
import { contentfulClient } from '@/lib/contentful-client';
import { gql } from 'graphql-request';

interface ItemsProps {
  _id: string;
  slug: string;
  title: string;
  headerImage: {
    description: string;
    url: string;
  };
  author: {
    name: string;
    authorProfilePicture: {
      description: string;
      title: string;
      url: string;
    };
  };
}


interface Props {
  blogPostCollection: {
    items: ItemsProps[];
  };
}

const GET_BLOGS = gql`
  query BlogPostCollection {
    blogPostCollection {
      items {
        headerImage {
          description
          url
        }
        slug
        title
        author {
          name
          authorProfilePicture {
            description
            title
            url
          }
        }
        _id
      }
    }
  }
`;

const useBlogCollection = () => {
    return useFetchData({
        queryKey: ["blogs"],
        queryFn: async () => {
            const data = await contentfulClient.request<Props>(GET_BLOGS);
            return data.blogPostCollection.items;
        },
    })
}

export default useBlogCollection;