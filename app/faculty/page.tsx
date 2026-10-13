import type { Metadata } from 'next'
import { getFacultiesSafe } from '@/lib/data/faculty'
import FacultyList from '@/components/faculty/FacultyList'

export async function generateMetadata(): Promise<Metadata> {
    const faculties = await getFacultiesSafe()
    const names = faculties.slice(0, 4).map((faculty) => faculty.name).join(', ')

    const description = names
        ? `Explore the ${faculties.length} faculties of the College of Engineering at KNUST, including ${names}.`
        : 'Explore the faculties of the College of Engineering at KNUST.'

    return {
        title: 'Faculties',
        description,
        alternates: { canonical: '/faculty' },
        openGraph: {
            title: 'Faculties | GESA-KNUST',
            description,
            url: '/faculty',
        },
    }
}

const FacultyListPage = async () => {
    const faculties = await getFacultiesSafe()

    return <FacultyList initialFaculties={faculties} />
}

export default FacultyListPage
