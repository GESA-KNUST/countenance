import { Suspense } from 'react';
import DepartmentContent from './DepartmentContent';
import { Metadata, ResolvingMetadata } from 'next';
import { gql } from "graphql-request";
import { contentfulClient } from "@/lib/contentful-client";
import StarSpinner from '@/components/ui/StarSpinner';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const id = searchParams.id;

    if (!id || Array.isArray(id)) {
        return {
            title: 'Department Detail',
        };
    }

    try {
        const data: any = await contentfulClient.request(GET_DEPARTMENT_FOR_METADATA, { id });
        const dept = data.department;

        if (!dept) {
            return {
                title: 'Department Not Found',
            };
        }

        return {
            title: `${dept.name} | GESA KNUST`,
            description: `Official page of the Department of ${dept.name} at KNUST.`,
            openGraph: {
                title: dept.name,
                images: dept.deptLogo?.url ? [dept.deptLogo.url] : [],
            },
        }
    } catch (error) {
        console.error(error);
        return {
            title: 'Department Detail',
        };
    }
}

export default function Page() {
    return (
        <Suspense fallback={<div className="h-[80vh] flex items-center justify-center bg-gray-50"><StarSpinner /></div>}>
            <DepartmentContent />
        </Suspense>
    );
}
