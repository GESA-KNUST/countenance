import React from 'react'
import Image, { StaticImageData } from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'

interface OpportunityCardProps {
    type: string
    icon: StaticImageData
    title: string
    description: string
    deadline: string
}

const OpportunityCard = ({ type, icon, title, description, deadline }: OpportunityCardProps) => {

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


    return (
        <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 relative overflow-hidden max-h-[400px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className='flex items-center gap-2 justify-between w-full'>
                <div className={`inline-flex items-center gap-2 ${getTypeColor(type)}  border border-slate-100 px-3 py-1.5 rounded-full z-10`}>
                    <span className="text-xs font-semibold uppercase tracking-wide">{type}</span>
                </div>
                <div className="relative w-4 h-4">
                    <Image src={icon} alt={type} fill className="object-contain" />
                </div>
            </div>

            <div className="z-10 flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
            <div className='flex items-center gap-2'>
                <Calendar size={14} />
                <span className="text-xs">Deadline: {deadline}</span>
            </div>

            <Button className="w-full mt-4 bg-primary hover:bg-slate-800 transition-all rounded-xl py-6 group-hover:shadow-lg z-10 cursor-pointer">
                View Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    )
}

export default OpportunityCard
