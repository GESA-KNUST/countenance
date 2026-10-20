'use client';
import Autoplay from "embla-carousel-autoplay"
import { contentfulImage } from '@/lib/contentful-image';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import StarSpinner from "../ui/StarSpinner";

const CAMERA = 1.6;
const MAX_TILE_WIDTH = 55;

const BAND = {
  speed: 4,
  aspect: 16 / 9,
  gap: 6,
  curve: 80,
  fade: 18,
  fill: 0.72,
};

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

interface BandLayout {
  columns: number;
  sweep: number;
  unit: number;
  limit: number;
  slices: number;
  axis: number;
  tilePct: number;
}

function measureBand(
  width: number,
  height: number,
  textBottom: number,
  footTop: number,
  stacked: boolean,
  bend: number
): BandLayout {
  const slices = 12;
  const round = (n: number) => +n.toFixed(1);

  const narrow = stacked;
  const widest = narrow ? 76 : MAX_TILE_WIDTH;
  const fill = narrow ? 0.6 : BAND.fill;
  const lift = narrow ? 0.38 : 0.5;

  const room = Math.max(0, footTop - textBottom);
  const tile = Math.min(room * fill, ((widest / 100) * width) / BAND.aspect);

  const half = tile / 2;
  const guard = narrow ? 20 : 0;
  const highest = textBottom + half + guard;
  const lowest = footTop - half - guard;
  const wanted = textBottom + room * lift;
  const centre =
    lowest >= highest
      ? Math.min(Math.max(wanted, highest), lowest)
      : (textBottom + footTop) / 2;
  const axis = round(Math.min(84, Math.max(50, (centre / (height || 1)) * 100)));
  const tilePct = round((tile / (height || 1)) * 100);

  const radius = width * arc(bend);
  if (!(tile > 0) || !(radius > 0)) {
    return { columns: 2, sweep: 0, unit: 0, limit: 0, slices, axis, tilePct };
  }

  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(tile / radius);
  const pitch = (BAND.aspect + BAND.gap / 100) * unit;
  const limit = deg(bend) + (BAND.aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const sweep = round((columns * pitch) / 2);

  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
    slices,
    axis,
    tilePct,
  };
}

interface HeroSectionProps {
  title?: string;
  highlight?: string;
  text: string | React.ReactNode;
  images?: (string | StaticImageData)[];
  mobileImages?: (string | StaticImageData)[];
  button?: boolean;
  buttonTarget?: string;
  isScroll?: boolean;
  overlayOpacity?: string;
  variant?: 'carousel' | 'band';
}

const HeroSection = ({
  title,
  highlight,
  text,
  images = ['/images/img1.webp', '/images/img2.webp', '/images/img1.webp', '/images/img2.webp'],
  mobileImages,
  button = true,
  buttonTarget,
  isScroll = false,
  overlayOpacity = 'bg-black/40',
  variant = 'carousel',
}: HeroSectionProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const slides = isMobile && mobileImages ? mobileImages : images;

  const plugin = useRef(
    Autoplay({
      delay: 10000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    })
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.reInit();
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, slides.length]);

  const handleDotClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  const bandRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const bandId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bend = (Math.min(85, Math.max(5, BAND.curve)) * Math.PI) / 180;
  const [layout, setLayout] = useState<BandLayout | null>(null);
  const [ready, setReady] = useState(false);
  const shots = useRef(new Map<number, HTMLImageElement[]>());

  const tiles = useMemo(
    () =>
      images.map((img) => {
        if (typeof img !== 'string') return { src: (img as StaticImageData).src, srcSet: '' };
        const picture = contentfulImage(img, {
          widths: [320, 480, 640, 960],
          quality: 78,
          aspect: BAND.aspect,
          focus: 'faces',
        });
        return { src: picture.src, srcSet: picture.srcSet };
      }),
    [images]
  );

  useEffect(() => {
    if (variant !== 'band') return;
    const hero = bandRef.current;
    if (!hero) return;

    const read = () => {
      const heroBox = hero.getBoundingClientRect();
      const contentBox = contentRef.current?.getBoundingClientRect();
      const ledeBox = ledeRef.current?.getBoundingClientRect();

      const headline = contentBox ? contentBox.bottom - heroBox.top : heroBox.height * 0.35;
      const lede = ledeBox
        ? { top: ledeBox.top - heroBox.top, bottom: ledeBox.bottom - heroBox.top }
        : null;

      const stacked = lede !== null && lede.top - headline > 40;
      const textBottom = stacked ? headline : lede ? lede.bottom : headline;
      const footTop = stacked && lede ? lede.top : heroBox.height;

      const next = measureBand(
        heroBox.width,
        heroBox.height,
        textBottom,
        footTop,
        stacked,
        bend
      );

      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit &&
        prev.slices === next.slices &&
        prev.axis === next.axis &&
        prev.tilePct === next.tilePct
          ? prev
          : next
      );
    };

    let queued = 0;
    const schedule = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        read();
      });
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    if (contentRef.current) observer.observe(contentRef.current);
    if (ledeRef.current) observer.observe(ledeRef.current);

    const settle = () => {
      read();
      setReady(true);
    };
    if (document.fonts?.ready) document.fonts.ready.then(settle).catch(settle);
    else settle();

    return () => {
      if (queued) cancelAnimationFrame(queued);
      observer.disconnect();
    };
  }, [variant, bend]);

  const readyRef = useRef(false);

  const reveal = (node: HTMLImageElement | null) => {
    if (!node || !readyRef.current) return;
    if (!node.complete || node.naturalWidth === 0) return;
    node.setAttribute('data-shown', '');
  };

  useEffect(() => {
    readyRef.current = ready;
    if (!ready) return;
    for (const row of shots.current.values()) {
      for (const node of row) reveal(node);
    }
  }, [ready]);

  const band = layout ?? measureBand(1200, 560, 200, 560, false, bend);
  const cycles = tiles.length > band.columns;

  useEffect(() => {
    if (variant !== 'band') return;
    for (const tile of tiles) {
      const preload = new window.Image();
      if (tile.srcSet) preload.srcset = tile.srcSet;
      preload.src = tile.src;
      preload.decode?.().catch(() => {});
    }
  }, [variant, tiles]);

  const titleParts = title && highlight ? title.split(highlight) : [title ?? ''];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isScroll && buttonTarget) {
      const element = document.getElementById(buttonTarget);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setLoading(true);
    setTimeout(() => {
      router.push(buttonTarget || '/blog');
    }, 1000);
  };

  const orbit = `hero-orbit-${bandId}`;
  const peek = `hero-peek-${bandId}`;
  const tileClass = `hero-tile-${bandId}`;
  const shotClass = `hero-shot-${bandId}`;
  const radiusPct = 100 * arc(bend);
  const unitOf = (n: number) => `calc(${+n.toFixed(4)} * var(--band-tile))`;
  const vanish = +(((band.sweep - band.limit) / (2 * band.sweep || 1)) * 100).toFixed(1);
  const duration = band.columns * BAND.speed;
  const share = BAND.aspect / band.slices;
  const bandMask = `linear-gradient(90deg,transparent,#000 ${BAND.fade}%,#000 ${100 - BAND.fade}%,transparent)`;
  const sliceMask =
    'linear-gradient(to bottom,transparent 0%,rgba(0,0,0,0.65) 7%,#000 20%,#000 80%,rgba(0,0,0,0.65) 93%,transparent 100%)';

  const orbitCss =
    `@keyframes ${orbit}{` +
    `from{transform:translateZ(var(--band-r)) rotateY(var(--band-from)) translateZ(calc(-1 * var(--band-r)))}` +
    `to{transform:translateZ(var(--band-r)) rotateY(var(--band-to)) translateZ(calc(-1 * var(--band-r)))}}` +
    `@media(prefers-reduced-motion:reduce){.${tileClass}{animation-play-state:paused}}` +
    `.${shotClass}{opacity:0;transition:opacity 700ms ease}` +
    `.${shotClass}[data-shown]{opacity:1}`;

  const peekCss =
    `@keyframes ${peek}{` +
    `0%,${vanish}%,${100 - vanish}%,100%{visibility:hidden}` +
    `${vanish + 0.1}%,${100 - vanish - 0.1}%{visibility:visible}}`;

  const bandVars = {
    '--band-r': `${+radiusPct.toFixed(3)}cqw`,
    '--band-from': `${-band.sweep}deg`,
    '--band-to': `${band.sweep}deg`,
    '--band-tile': `${band.tilePct}cqh`,
  } as React.CSSProperties;

  return (
    <div
      ref={bandRef}
      style={variant === 'band' ? { containerType: 'size' } : undefined}
      className={`relative w-full font-poppins flex overflow-hidden md:h-[calc(100vh-var(--navbar-height))] ${
        variant === 'band'
          ? 'h-[53vh] min-h-[420px] md:min-h-0 flex-col items-center justify-start bg-white'
          : 'h-[60vh] items-center justify-center bg-[#252638]'
      }`}
    >

      {variant === 'band' ? (
        <>
          <style>{orbitCss}</style>
          <style>{peekCss}</style>
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 transition-opacity duration-500'
            style={{
              ...bandVars,
              opacity: layout ? 1 : 0,
              perspective: `${+(radiusPct * CAMERA).toFixed(3)}cqw`,
              perspectiveOrigin: `50% ${band.axis}%`,
              maskImage: bandMask,
              WebkitMaskImage: bandMask,
            }}
          >
            {Array.from({ length: band.columns }, (_, t) => {
              const first = band.columns - 1 - t;
              const tile = tiles[first % Math.max(tiles.length, 1)];

              return (
                <div
                  key={t}
                  className={`${tileClass} absolute`}
                  style={{
                    left: `calc(50% - ${unitOf(BAND.aspect / 2)})`,
                    top: `calc(${band.axis}% - ${unitOf(0.5)})`,
                    width: unitOf(BAND.aspect),
                    height: unitOf(1),
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    animation:
                      `${orbit} ${duration}s linear ${-t * BAND.speed}s infinite,` +
                      `${peek} ${duration}s linear ${-t * BAND.speed}s infinite`,
                  }}
                  onAnimationIteration={
                    cycles
                      ? (event) => {
                          if (event.animationName !== orbit) return;
                          const lap = Math.round(event.elapsedTime / duration);
                          const next = tiles[(lap * band.columns + first) % tiles.length];
                          if (!next) return;
                          for (const node of shots.current.get(t) ?? []) {
                            if (node.src !== next.src) {
                              node.srcset = next.srcSet || '';
                              node.src = next.src;
                            }
                          }
                        }
                      : undefined
                  }
                >
                  {Array.from({ length: band.slices }, (_, k) => (
                    <div
                      key={k}
                      className='absolute top-0 overflow-hidden'
                      style={{
                        maskImage: sliceMask,
                        WebkitMaskImage: sliceMask,
                        backfaceVisibility: 'hidden',
                        backgroundColor: '#e9ecef',
                        left: unitOf((BAND.aspect - share) / 2),
                        width:
                          k === band.slices - 1
                            ? unitOf(share)
                            : `calc(${unitOf(share)} + 1px)`,
                        height: unitOf(1),
                        transform:
                          `translateZ(var(--band-r)) ` +
                          `rotateY(${+((BAND.aspect / 2 - (k + 0.5) * share) * band.unit).toFixed(4)}deg) ` +
                          `translateZ(calc(-1 * var(--band-r)))`,
                      }}
                    >
                      {tile ? (
                        <img
                          ref={(node) => {
                            const row = shots.current.get(t) ?? [];
                            if (node) row[k] = node;
                            shots.current.set(t, row);
                            reveal(node);
                          }}
                          onLoad={(event) => reveal(event.currentTarget)}
                          src={tile.src}
                          srcSet={tile.srcSet || undefined}
                          sizes='(max-width: 768px) 55vw, 30vw'
                          alt=''
                          draggable={false}
                          decoding='async'
                          className={`${shotClass} absolute top-0 max-w-none object-cover`}
                          style={{
                            left: unitOf(-k * share),
                            width: unitOf(BAND.aspect),
                            height: unitOf(1),
                          }}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      ) : (
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="w-full h-full absolute inset-0"
        opts={{
          loop: true,
          duration: 80,

        }}
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((img, index) => (
            <CarouselItem key={index} className="relative h-[60vh] md:h-[calc(100vh-var(--navbar-height))] w-full pl-0">
              {typeof img !== 'string' ? (
                <Image
                  src={img}
                  alt={`Hero image ${index + 1}`}
                  fill
                  className={`object-cover ${isMobile ? 'object-top' : 'object-[center_25%]'}`}
                  priority={index === 0}
                  sizes="100vw"
                />
              ) : (() => {
                const hero = contentfulImage(img, {
                  widths: [640, 828, 1080, 1440, 1920, 2560],
                  quality: 78,
                  aspect: isMobile ? 3 / 4 : 16 / 9,
                  focus: isMobile ? 'top' : 'faces',
                });
                return (
                  <img
                    src={hero.src}
                    srcSet={hero.srcSet || undefined}
                    sizes="100vw"
                    alt={`Hero image ${index + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover ${isMobile ? 'object-top' : 'object-[center_25%]'}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    decoding="async"
                  />
                );
              })()}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      )}

      {variant !== 'band' && <div className={`absolute inset-0 ${overlayOpacity} z-10`} />}

      {/* Content */}
      <motion.div
        ref={contentRef}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.2,
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }}
        className={`relative z-20 flex flex-col items-center justify-center px-4 text-center max-w-360 mx-auto gap-3 ${
          variant === 'band'
            ? 'w-full text-[#252638] pt-[2vh] md:pt-[3vh]'
            : 'text-white md:-mt-32'
        }`}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
          className='font-bold font-header text-3xl leading-tight sm:text-[50px] sm:leading-tight md:text-[68px] md:leading-[76px] lg:text-[75px] xl:text-[85px] lg:leading-[90px]'
        >
          {titleParts[0]}
          <span className="text-yellow-500 font-header">{highlight}</span>
          {titleParts[1]}
        </motion.h1>

        {variant !== 'band' && (
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className='text-sm sm:text-lg md:text-xl max-w-3xl mx-auto'
          >
            {text}
          </motion.p>
        )}

        {button && variant !== 'band' && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center w-full h-12" >
                <StarSpinner />
              </div>
            ) : (
              <button onClick={handleClick} className="bg-primary font-semibold rounded-full md:rounded-lg flex items-center gap-1 md:px-6 px-4 py-2 cursor-pointer text-black md:text-base text-xs hover:scale-105 transition-transform">
                Explore more <ArrowUpRight className='text-black w-5 h-5 md:w-7 md:h-7' strokeWidth={2.5} />
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {variant === 'band' && (
        <motion.p
          ref={ledeRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className='relative z-20 w-full px-4 text-center max-w-3xl mx-auto text-[#252638] mt-auto pb-[3vh] text-sm sm:text-lg md:text-xl md:mt-3 md:pb-0'
        >
          {text}
        </motion.p>
      )}

      {variant !== 'band' && (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="flex gap-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              onClick={() => handleDotClick(index)}
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-4 h-4 ${current === index ? 'bg-white' : 'bg-white/30'} rounded-full cursor-pointer transition-all duration-300 hover:bg-white/60`}
            />
          ))}
        </div>
      </div>
      )}

    </div >
  );
};

export default HeroSection;
