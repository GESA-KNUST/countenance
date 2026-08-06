import { Suspense } from 'react';
import { Metadata } from 'next';
import { gql } from 'graphql-request';
import { contentfulClient } from '@/lib/contentful-client';
import StarSpinner from '@/components/ui/StarSpinner';
import { LogError } from '@/lib/logger';
import DepartmentContent from './DepartmentContent';

type Props = {
    params: Promise<{ id: string }>;
};

interface DepartmentMetadataResponse {
    departmentCollection: {
        items: {
            name: string;
            deptAbbreviation: string;
            deptLogo: { url: string } | null;
        }[];
    };
}

const GET_DEPARTMENT_FOR_METADATA = gql`
    query GetDepartmentForMetadata($id: String!) {
        departmentCollection(where: { sys: { id: $id } }, limit: 1) {
            items {
                name
                deptAbbreviation
                deptLogo {
                    url
                }
            }
        }
    }
`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    if (!id) {
        return { title: 'Department Detail' };
    }

    try {
        const data = await contentfulClient.request<DepartmentMetadataResponse>(
            GET_DEPARTMENT_FOR_METADATA,
            { id }
        );
        const dept = data.departmentCollection.items[0];

        if (!dept) {
            return { title: 'Department Not Found' };
        }

        return {
            title: `${dept.name} | GESA KNUST`,
            description: `Official page of the Department of ${dept.name} at KNUST.`,
            openGraph: {
                title: dept.name,
                images: dept.deptLogo?.url ? [dept.deptLogo.url] : [],
            },
        };
    } catch (error) {
        LogError('Error generating department metadata:', error);
        return { title: 'Department Detail' };
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
            <DepartmentContent />
        </Suspense>
    );
}
