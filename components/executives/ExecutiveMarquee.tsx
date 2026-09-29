'use client';

import { useEffect, useRef, useState } from 'react';
import { contentfulImage } from '@/lib/contentful-image';
import { User } from 'lucide-react';
import { type Executive } from '@/lib/data/executive';

interface ExecutiveMarqueeProps {
  executives: Executive[];
  isLoading: boolean;
  year: string | null;
}

const PIXELS_PER_SECOND = 32;

const Portrait = ({ executive }: { executive: Executive }) => {
  const { fullName, officialImage } = executive;

  return (
    <figure className="w-[92px] shrink-0 sm:w-[104px]">
      <div className="relative mx-auto aspect-square w-16 overflow-hidden rounded-full bg-slate-100 ring-1 ring-black/5 sm:w-20">
        {officialImage?.url ? (() => {
          const portrait = contentfulImage(officialImage.url, {
            widths: [128, 160, 240],
            aspect: 1,
            focus: 'face',
            quality: 78,
          });
          return (
            <img
              src={portrait.src}
              srcSet={portrait.srcSet || undefined}
              sizes="(max-width: 640px) 64px, 80px"
              alt={officialImage.description || fullName}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          );
        })() : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <User size={24} strokeWidth={1.25} />
          </div>
        )}
      </div>

      <figcaption className="mt-2 truncate text-center text-[11px] font-medium text-slate-500">
        {fullName.split(' ')[0]}
      </figcaption>
    </figure>
  );
};

const Item = ({ executive, hidden }: { executive: Executive; hidden?: boolean }) => {
  const scrollToExecutives = () => {
    document.getElementById('executives')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={scrollToExecutives}
      aria-label={`See ${executive.fullName} and the rest of the executives`}
      tabIndex={hidden ? -1 : undefined}
      className="mr-4 cursor-pointer snap-start rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBE00] sm:mr-6"
    >
      <Portrait executive={executive} />
    </button>
  );
};

const ExecutiveMarquee = ({ executives, isLoading, year }: ExecutiveMarqueeProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const [laneWidth, setLaneWidth] = useState(0);
  const [copies, setCopies] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    const lane = laneRef.current;
    if (!frame || !lane) return;

    const measure = () => {
      const width = lane.scrollWidth;
      if (!width) return;

      setLaneWidth(width);
      setCopies((previous) => Math.max(previous, Math.ceil(frame.clientWidth / width) || 1));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(lane);
    return () => observer.disconnect();
  }, [executives]);

  if (isLoading) {
    return (
      <div className="border-b border-slate-100 bg-white py-6 sm:py-8">
        <div className="flex gap-6 overflow-hidden px-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-[92px] shrink-0 sm:w-[104px]">
              <div className="mx-auto aspect-square w-16 animate-pulse rounded-full bg-slate-200 sm:w-20" />
              <div className="mx-auto mt-2 h-2.5 w-12 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (executives.length === 0) return null;

  const running = copies > 0;
  const half = Array.from({ length: Math.max(copies, 1) }, () => executives).flat();
  const duration = Math.max(8, Math.round((laneWidth * Math.max(copies, 1)) / PIXELS_PER_SECOND));

  return (
    <section
      className="border-b border-slate-100 bg-white py-6 sm:py-8"
      aria-label={year ? `${year} executives` : 'Executives'}
    >
      <div
        ref={frameRef}
        className="marquee marquee-mask overflow-hidden"
        style={
          {
            ['--marquee-duration' as string]: `${duration}s`,
          } as React.CSSProperties
        }
      >
        <div className={`flex w-max ${running ? 'marquee-track' : ''}`}>
          <div ref={laneRef} className="flex shrink-0">
            {executives.map((executive) => (
              <Item key={executive.sys.id} executive={executive} />
            ))}
          </div>

          {running && (
          <div className="flex shrink-0" aria-hidden>
            {half.slice(executives.length).map((executive, index) => (
              <Item key={`fill-${executive.sys.id}-${index}`} executive={executive} hidden />
            ))}
            {half.map((executive, index) => (
              <Item key={`loop-${executive.sys.id}-${index}`} executive={executive} hidden />
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExecutiveMarquee;
