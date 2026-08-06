import { Suspense } from 'react';
import { Metadata } from 'next';
import { gql } from 'graphql-request';
import { contentfulClient } from '@/lib/contentful-client';
import StarSpinner from '@/components/ui/StarSpinner';
import { LogError } from '@/lib/logger';
import FacultyContent from './FacultyContent';

type Props = {
    params: Promise<{ id: string }>;
};

interface FacultyMetadataResponse {
    facultyCollection: {
        items: {
            name: string;
            facultyMainImageCollection: { items: { url: string }[] };
        }[];
    };
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    if (!id) {
        return { title: 'Faculty Detail' };
    }

    try {
        const data = await contentfulClient.request<FacultyMetadataResponse>(
            GET_FACULTY_FOR_METADATA,
            { id }
        );
        const faculty = data.facultyCollection.items[0];

        if (!faculty) {
            return { title: 'Faculty Not Found' };
        }

        const image = faculty.facultyMainImageCollection?.items?.[0]?.url;

        return {
            title: `${faculty.name} | GESA KNUST`,
            description: `Official page of the ${faculty.name} at KNUST.`,
            openGraph: {
                title: faculty.name,
                images: image ? [image] : [],
            },
        };
    } catch (error) {
        LogError('Error generating faculty metadata:', error);
        return { title: 'Faculty Detail' };
    }
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="h-[80vh] flex items-center justify-center bg-gray-50">
                    <StarSpinner />
                </div>
            }
        >
            <FacultyContent />
        </Suspense>
    );
}
