import React from 'react'
import Container from './Container'
import { TriangleAlert } from 'lucide-react'

const FetchError = () => {
    return (
        <Container size='xl' className='font-header'>
            <div className='my-16 flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 text-center'>
                <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                    <TriangleAlert className="w-6 h-6 text-red-600" />
                </div>
                <h3 className='text-xl font-bold text-red-900 mb-2'>Unable to load content</h3>
                <p className='text-red-700 max-w-md mx-auto sm:text-base text-sm'>
                    We encountered an issue retrieving the information. Please try refreshing the page.
                </p>
            </div>
        </Container>
    )
}

export default FetchError