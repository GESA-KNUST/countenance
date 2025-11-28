import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "../lib/contentful-client";

interface ItemsProps {
    _id: string;
    slug: string;
    title: string;
    eventDate: string,
    description: string,
    venue: string;
    onlineLink: string;
    eventImage: {
        description: string;
        url: string;
    };
}

interface Props {
    eventCardCollection: {
        items: ItemsProps[];
    };
}

const GET_EVENTS = gql`
    query EventCardCollection {
        eventCardCollection {
            items {
                _id
                title
                slug
                eventDate
                description
                venue
                onlineLink
                eventImage {
                    url
                    description
                }
            }
        }
    }
`;




const useEventCollection = () => {
    return useFetchData({
        queryKey: ["events"],
        queryFn: async () => {
            const data = await contentfulClient.request<Props>(GET_EVENTS);
            return data.eventCardCollection.items;
        },
    })
}

export default useEventCollection;