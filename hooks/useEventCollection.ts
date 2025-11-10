import { gql } from "graphql-request";
import { useFetchData } from "./useFetchData";
import { contentfulClient } from "@/lib/contentful-client";

interface ItemsProps {
    _id: string;
    slug: string;
    eventDate: string,
    description: string,
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
            eventImage {
                url
                description
            }
            slug
            eventDate
            description
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