'use client'

import Container from '@/components/custom/Container'
import DepartmentHero from '@/components/department/DepartmentHero'
import { Search, Globe } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDepartmentCollection } from '@/hooks/useDepartmentCollection'
import Image from 'next/image'
import EmptyState from '@/components/events/EmptyState'
import { LayoutGrid } from 'lucide-react'
import { DepartmentGridSkeleton } from '@/components/department/DepartmentSkeleton'

const DepartmentListPage = () => {
    const [search, setSearch] = useState<string>('');
    const { data: departments, isLoading, error } = useDepartmentCollection();

    const filteredDepartments = departments?.filter(dept =>
        dept.name.toLowerCase().includes(search.toLowerCase()) ||
        dept.deptAbbreviation?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='font-poppins min-h-screen bg-white'>
            <DepartmentHero
                title="FIND YOUR"
                subtitle="DEPARTMENT"
                text='Choose from our diverse departments designed to equip you with skills, knowledge, and hands-on experience.'
                images={['/images/img1.png', '/images/img2.png', '/images/img1.png', '/images/img2.png']}
            />
            <Container size='xl'>
                <div className='flex flex-col md:flex-row items-center justify-center gap-6 py-6 md:py-12'>
                    <div className='w-full max-w-2xl border border-gray-200 h-16 rounded-2xl flex items-center px-6 bg-gray-50/50 focus-within:bg-white focus-within:border-primary transition-all shadow-sm'>
                        <Search className='text-gray-400' size={20} />
                        <input
                            type="text"
                            placeholder='Search departments by name or abbreviation...'
                            className='w-full p-4 rounded-xl h-full outline-0 text-gray-700 font-medium'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ul className='flex gap-2 flex-wrap justify-center'>
                        <li className='bg-black text-white px-8 py-3.5 font-header font-bold rounded-full cursor-pointer hover:bg-gray-900 transition-all shadow-lg'>
                            {departments?.length || 0} Departments
                        </li>
                    </ul>
                </div>
            </Container>

            <Container size='xl'>
                <div className='pb-20'>
                    {isLoading ? (
                        <DepartmentGridSkeleton />
                    ) : error ? (
                        <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
                            <p className="text-red-500 font-bold text-lg">Failed to load departments. Please try again later.</p>
                        </div>
                    ) : filteredDepartments?.length === 0 ? (
                        <EmptyState
                            icon={LayoutGrid}
                            title="No departments match your search"
                            message={`We couldn't find any departments matching "${search}". Try checking your spelling or using a different keyword.`}
                            onRefresh={() => setSearch('')}
                            showHomeButton={false}
                        />
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {filteredDepartments?.map((dept) => (
                                <div key={dept.sys.id} className='group bg-white p-8 rounded-[2.5rem] flex flex-col gap-6 w-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-2'>
                                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6">
                                        <div className='w-16 h-16 shrink-0 rounded-2xl bg-gray-50 p-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500'>
                                            {dept.deptLogo?.url ? (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={dept.deptLogo.url}
                                                        alt={dept.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <Globe size={32} className="text-gray-300 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 md:gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                                                    {dept.deptAbbreviation || "DEPT"}
                                                </span>
                                            </div>
                                            <h2 className='font-bold text-xl md:text-2xl font-header text-gray-900 line-clamp-2 min-h-0 md:min-h-[4rem] group-hover:text-primary transition-colors'>
                                                {dept.name}
                                            </h2>
                                        </div>
                                    </div>
                                    <p className='text-gray-500 text-sm leading-relaxed line-clamp-3'>
                                        Explore the academic excellence and innovative initiatives of the {dept.name} at KNUST.
                                    </p>
                                    <div className='w-full pt-4 mt-auto'>
                                        <Link
                                            href={`/department-detail?id=${dept.sys.id}`}
                                            className='bg-black text-white px-6 py-4 rounded-2xl w-full font-bold hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg shadow-black/5 hover:shadow-primary/20'
                                        >
                                            View Department
                                            <div className="w-0 overflow-hidden group-hover/btn:w-4 transition-all duration-300">
                                                →
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default DepartmentListPage