
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface ExecutiveCardProps {
  image: string;
  name: string;
  position: string;
}

const ExecutiveCard = ({ image, name, position }: ExecutiveCardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-[252px]">
        <Image src={image} alt={name} fill objectFit="cover" />
      </div>
      <div className="p-6">
        <h3 className="text-sm font-semibold text-[#FFBE00]">{position}</h3>
        <div className="flex justify-between items-center mt-3">
          <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
          <ArrowUpRight className="h-6 w-6 text-gray-900" />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCard;
