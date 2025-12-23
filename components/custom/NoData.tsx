import React from 'react'
import Container from './Container'
import { FolderOpen } from 'lucide-react'

interface NoDataProps {
    title?: string;
    description?: string;
}

const NoData = ({
    title = "No information found",
    description = "There are no records to display at this time."
}: NoDataProps) => {
    return (
        <Container size='xl' className='font-header'>
            <div className='my-16 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center'>
                <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                    <FolderOpen className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>{title}</h3>
                <p className='text-gray-500 max-w-md mx-auto sm:text-base text-sm'>
                    {description}
                </p>
            </div>
        </Container>
    )
}

export default NoData