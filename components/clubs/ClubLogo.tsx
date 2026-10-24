import Image from 'next/image';
import { ctfSrc } from '@/lib/contentful-src';
import { cn } from '@/lib/utils';

const SKIP_WORDS = new Set(['of', 'and', 'the', 'for', 'in', 'knust', '&', '-']);

export function clubMonogram(name: string) {
    const abbreviation = name.match(/\(([^)]+)\)/)?.[1]?.trim();
    if (abbreviation && abbreviation.length <= 8) return abbreviation;

    const initials = name
        .split(/\s+/)
        .filter((word) => word && !SKIP_WORDS.has(word.toLowerCase()))
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    return initials.slice(0, 3) || name.slice(0, 2).toUpperCase();
}

interface ClubLogoProps {
    name: string;
    url?: string | null;
    alt?: string | null;
    width: number;
    className?: string;
    imageClassName?: string;
    monogramClassName?: string;
}

const ClubLogo = ({ name, url, alt, width, className, imageClassName, monogramClassName }: ClubLogoProps) => {
    if (url) {
        return (
            <div className={cn('relative overflow-hidden', className)}>
                <Image src={ctfSrc(url, width)} alt={alt || name} fill className={cn('object-contain', imageClassName)} unoptimized />
            </div>
        );
    }

    return (
        <div
            role="img"
            aria-label={name}
            className={cn(
                'relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FFCE33] to-[#FFAA00]',
                className
            )}
        >
            <div className="absolute -top-1/3 -right-1/3 w-full h-full rounded-full border-[10px] border-white/20" />
            <div className="absolute -bottom-1/2 -left-1/4 w-3/4 h-3/4 rounded-full bg-white/15" />
            <span className={cn('relative font-header font-black text-gray-900 tracking-tight', monogramClassName)}>
                {clubMonogram(name)}
            </span>
        </div>
    );
};

export default ClubLogo;
