import type { Metadata } from 'next'
import { getDepartmentsSafe } from '@/lib/data/department'
import DepartmentList from '@/components/department/DepartmentList'

export async function generateMetadata(): Promise<Metadata> {
    const departments = await getDepartmentsSafe()
    const names = departments.slice(0, 4).map((department) => department.name).join(', ')

    const description = names
        ? `Explore the ${departments.length} departments of the College of Engineering at KNUST, including ${names}.`
        : 'Explore the departments of the College of Engineering at KNUST.'

    return {
        title: 'Departments',
        description,
        alternates: { canonical: '/department' },
        openGraph: {
            title: 'Departments | GESA-KNUST',
            description,
            url: '/department',
        },
    }
}

const DepartmentListPage = async () => {
    const departments = await getDepartmentsSafe()

    return <DepartmentList initialDepartments={departments} />
}

export default DepartmentListPage
