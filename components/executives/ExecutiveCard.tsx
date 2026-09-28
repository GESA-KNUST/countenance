import { contentfulImage } from '@/lib/contentful-image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { type Executive, executiveSlug, hasProfile } from '@/lib/data/executive';

const ExecutiveCard = ({ executive }: { executive: Executive }) => {
  const { fullName, executivePositionHeld, officialImage, programmeOfStudy } = executive;
  const profile = hasProfile(executive);

  const card = (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-500 h-full flex flex-col">
      <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-gray-100">
        {officialImage?.url && (() => {
          const portrait = contentfulImage(officialImage.url, {
            widths: [320, 480, 640, 960],
            aspect: 4 / 3,
            focus: 'face',
          });
          return (
            <img
              src={portrait.src}
              srcSet={portrait.srcSet || undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={officialImage.description || fullName}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          );
        })()}
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="text-sm font-semibold text-[#FFBE00] font-header">
          {executivePositionHeld}
        </h3>
        <h2 className="text-2xl font-semibold text-gray-900 font-header mt-3">{fullName}</h2>

        {programmeOfStudy && (
          <p className="text-sm text-gray-500 mt-1">{programmeOfStudy}</p>
        )}

        {profile && (
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#252638]">
            View profile <ArrowUpRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );

  if (profile) {
    return (
      <Link href={`/executives/${executiveSlug(executive)}`} className="block h-full">
        {card}
      </Link>
    );
  }

  if (executive.primarySocialLink) {
    return (
      <a
        href={executive.primarySocialLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {card}
      </a>
    );
  }

  return card;
};

export default ExecutiveCard;
