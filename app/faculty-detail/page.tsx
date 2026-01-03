import { Suspense } from 'react';
import FacultyContent from './FacultyContent';
import { Metadata, ResolvingMetadata } from 'next';
import { gql } from "graphql-request";
import { contentfulClient } from "@/lib/contentful-client";
import StarSpinner from '@/components/ui/StarSpinner';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const GET_FACULTY_FOR_METADATA = gql`
    query GetFacultyForMetadata($id: String!) {
        facultyCollection(where: { sys: { id: $id } }, limit: 1) {
            items {
                name
                facultyMainImageCollection(limit: 1) {
                    items {
                        url
                    }
                }
            }
        }
    }
`;

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const id = searchParams.id;

    if (!id || Array.isArray(id)) {
        return {
            title: 'Faculty Detail',
        };
    }

    try {
        const data: any = await contentfulClient.request(GET_FACULTY_FOR_METADATA, { id });
        const faculty = data.facultyCollection.items[0];

        if (!faculty) {
            return {
                title: 'Faculty Not Found',
            };
        }

        return {
            title: `${faculty.name} | GESA KNUST`,
            description: `Official page of the ${faculty.name} at KNUST.`,
            openGraph: {
                title: faculty.name,
                images: faculty.facultyMainImageCollection?.items?.[0]?.url
                    ? [faculty.facultyMainImageCollection.items[0].url]
                    : [],
            },
        }
    } catch (error) {
        console.error(error);
        return {
            title: 'Faculty Detail',
        };
    }
}

export default function Page() {
    return (
        <Suspense fallback={<div className="h-[80vh] flex items-center justify-center bg-gray-50"><StarSpinner /></div>}>
            <FacultyContent />
        </Suspense>
    );
}
