'use client';
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { contentfulClient } from "../lib/contentful-client";

interface Author {
    name: string;
    authorProfilePicture: {
        url: string;
        title: string;
    };
}

interface Blog {
    title: string;
    slug: string;
    headerImage: {
        title: string;
        url: string;
    };
    author: Author;
    hook: string;
    tags: {
        tags: string[];
    };
    blogContent: {
        json: any;
    };
    datePublished: string;
    _id
}

interface Props {
    blogPostCollection: {
        items: Blog[];
    };
}

const GET_BLOGS = gql`
    query {
        blogPostCollection {
            items {
                headerImage {
                    title
                    url
                }
                slug
                author {
                    name
                    authorProfilePicture {
                        url
                        title
                    }
                }
                blogContent {
                    json
                }
                hook
                tags {
                    tags
                }
                title
                datePublished
                _id
            }
        }
    }
`;

const useBlogCollection = () => {
    return useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const data = await contentfulClient.request<Props>(GET_BLOGS);
            return data.blogPostCollection.items;
        },
    })
}

export default useBlogCollection;