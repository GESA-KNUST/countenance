import { gql } from "graphql-request";
import { requestTolerant } from "../contentful-client";
import { LogError } from "../logger";

export interface BlogAuthorOption {
  id: string;
  name: string;
  photoUrl: string | null;
}

const GET_AUTHORS = gql`
  query BlogAuthors {
    blogAuthorCollection(limit: 100, order: [name_ASC]) {
      items {
        sys {
          id
        }
        name
        authorProfilePicture {
          url
        }
      }
    }
  }
`;

interface Response {
  blogAuthorCollection: {
    items: {
      sys: { id: string };
      name: string | null;
      authorProfilePicture: { url: string } | null;
    }[];
  };
}

export async function getBlogAuthors(): Promise<BlogAuthorOption[]> {
  try {
    const data = await requestTolerant<Response>(GET_AUTHORS);
    return (data.blogAuthorCollection.items ?? [])
      .filter((item) => item.name)
      .map((item) => ({
        id: item.sys.id,
        name: item.name as string,
        photoUrl: item.authorProfilePicture?.url ?? null,
      }));
  } catch (error) {
    LogError("[getBlogAuthors]", error);
    return [];
  }
}
