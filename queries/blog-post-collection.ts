import { gql } from "graphql-request";

export interface ItemsProps {
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

export const GET_POSTS = gql`
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
