import Image from 'next/image';
import star from '@/public/images/star.svg';

interface SectionEyebrowProps {
    label: string;
}


const SectionEyebrow = ({ label }: SectionEyebrowProps) => (
    <div className="flex items-center gap-3">
        <Image src={star} alt="" width={14} height={14} className="w-4 h-4" />
        <p className="text-primary font-bold text-sm tracking-wider uppercase">{label}</p>
        <Image src={star} alt="" width={14} height={14} className="w-4 h-4" />
    </div>
);

export default SectionEyebrow;
