import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'
import internship from '@/public/images/internship.svg'
import scholarship from '@/public/images/scholarship.svg'
import financialAid from '@/public/images/financial-aid.svg'
import announcement from '@/public/images/announcement.svg'
import { hubItem } from '@/hooks/useHubs'


const OpportunityCard = ({
    title,
    description,
    applicationDeadline,
    source,
    opportunityType,
    _id
}: hubItem) => {

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'internship':
                return 'bg-primary/80'
            case 'scholarship':
                return 'bg-slate-50'
            case 'financial aid':
                return 'bg-black text-white'
            default:
                return 'bg-slate-50'
        }
    }

    const getIconType = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'internship':
                return internship
            case 'scholarship':
                return scholarship
            case 'financial aid':
                return financialAid
            default:
                return announcement
        }
    }


    return (
        <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className='flex items-center gap-2 justify-between w-full'>
                <div className={`inline-flex items-center gap-2 ${opportunityType && getTypeColor(opportunityType)}  border border-slate-100 px-3 py-1.5 rounded-full z-10`}>
                    <span className="text-xs font-semibold uppercase tracking-wide">{opportunityType}</span>
                </div>
                <div className="relative w-4 h-4">
                    <Image src={getIconType(opportunityType)} alt={opportunityType || 'opportunity icon'} fill className="object-contain" />
                </div>
            </div>

            <div className="z-10 flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors font-header">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description.slice(0, 150) + '...'}</p>
            </div>
            <div className='flex items-center gap-2'>
                <Calendar size={14} />
                <span className="text-xs">Deadline: {new Date(applicationDeadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}</span>
            </div>

            <a href={source} target="_blank" rel="noopener noreferrer" className='font-medium inline-flex justify-center items-center w-full mt-3 bg-primary hover:bg-slate-800 hover:text-white transition-all rounded-xl py-3 group-hover:shadow-lg z-10 cursor-pointer'>
                View Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
    )
}

export default OpportunityCard
