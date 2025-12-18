import Image from 'next/image';

interface ExecutiveCardProps {
  image: string;
  name: string;
  position: string;
  primarySocialLink?: string;
}

const ExecutiveCard = ({ image, name, position, primarySocialLink }: ExecutiveCardProps) => {
  const cardContent = (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-500 h-full flex flex-col">
      <div className="relative h-[252px] shrink-0">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="text-sm font-semibold text-[#FFBE00]">{position}</h3>
        <div className="flex justify-between items-center mt-3">
          <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
        </div>
      </div>
    </div>
  );

  if (primarySocialLink) {
    return (
      <a
        href={primarySocialLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default ExecutiveCard;
