import Image from 'next/image';
import { ctfSrc } from '@/lib/contentful-src';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import {
  ArrowLeft,
  Linkedin,
  Instagram,
  Mail,
  Globe,
  Link2,
  Quote,
  BadgeCheck,
} from 'lucide-react';
import Container from '../custom/Container';
import { proseRichTextOptions } from '@/lib/richTextOptions';
import { contentfulImage } from '@/lib/contentful-image';
import { type Executive, executiveSlug, hasBioContent } from '@/lib/data/executive';

interface ExecutiveProfileProps {
  executive: Executive;
  colleagues: Executive[];
}

const ExecutiveProfile = ({ executive, colleagues }: ExecutiveProfileProps) => {
  const {
    fullName,
    executivePositionHeld,
    academicYear,
    officialImage,
    programmeOfStudy,
    quote,
    bio,
    achievements,
    portfolioImagesCollection,
    portfolioLink,
    linkedInUrl,
    instagramUrl,
    xUrl,
    email,
    primarySocialLink,
  } = executive;

  const bioAssets = (bio?.links?.assets?.block ?? []).filter(
    (asset): asset is NonNullable<typeof asset> => Boolean(asset?.url)
  );

  const portfolio = (portfolioImagesCollection?.items ?? []).filter(
    (image): image is NonNullable<typeof image> => Boolean(image?.url)
  );

  const socials = [
    { href: linkedInUrl, label: 'LinkedIn', Icon: Linkedin },
    { href: instagramUrl, label: 'Instagram', Icon: Instagram },
    { href: xUrl, label: 'X', Icon: Link2 },
    { href: portfolioLink, label: 'Portfolio', Icon: Globe },
    { href: email ? `mailto:${email}` : null, label: 'Email', Icon: Mail },
  ].filter((social): social is { href: string; label: string; Icon: typeof Mail } =>
    Boolean(social.href)
  );

  if (socials.length === 0 && primarySocialLink) {
    socials.push({ href: primarySocialLink, label: 'Profile', Icon: Link2 });
  }

  return (
    <div className="font-poppins bg-white min-h-screen">
      <div className="relative overflow-hidden border-b border-gray-100 bg-white">
        <Container size="xl" className="relative">
          <Link
            href="/executives"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#252638]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All executives
          </Link>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 md:mt-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12 lg:gap-16">
            <div className="relative mx-auto w-full max-w-[280px] md:mx-0 md:max-w-none">
              <div
                aria-hidden
                className="absolute -bottom-3 -left-3 h-24 w-24 rounded-2xl bg-[#FFBE00] md:-bottom-4 md:-left-4 md:h-32 md:w-32"
              />
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-xl ring-1 ring-black/5">
                {officialImage?.url && (
                  <Image
                    src={ctfSrc(officialImage.url, 640)}
                    alt={officialImage.description || fullName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, 320px"
                    priority
                      unoptimized
                  />
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#FFBE00]" />
                <p className="font-header text-xs font-bold uppercase tracking-[0.2em] text-[#B88900]">
                  {executivePositionHeld}
                </p>
              </div>

              <h1 className="mt-4 font-header text-4xl font-bold leading-[1.05] tracking-tight text-[#252638] sm:text-5xl lg:text-6xl">
                {fullName}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#252638] px-3.5 py-1.5 text-xs font-bold tracking-wide text-white">
                  {academicYear}
                </span>
                {programmeOfStudy && (
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600">
                    {programmeOfStudy}
                  </span>
                )}
              </div>

              {socials.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2.5">
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      title={label}
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:-translate-y-0.5 hover:border-[#252638] hover:bg-[#252638] hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 min-w-0">
            {hasBioContent(executive) && bio?.json ? (
              <div className="max-w-none">
                <h2 className="font-header font-bold text-2xl text-[#252638] mb-5">Biography</h2>
                {documentToReactComponents(bio.json as Document, proseRichTextOptions(bioAssets))}
              </div>
            ) : (
              <p className="text-gray-500">
                A full biography for {fullName} has not been added yet.
              </p>
            )}

            {quote && (
              <figure className="mt-12 border-t border-gray-200 pt-10">
                <Quote className="h-7 w-7 text-gray-300" aria-hidden />
                <blockquote className="mt-3 font-header text-2xl leading-snug text-[#252638] md:text-[1.75rem]">
                  {quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                  <span className="h-px w-8 bg-gray-300" />
                  {fullName}
                </figcaption>
              </figure>
            )}

            {portfolio.length > 0 && (
              <div className="mt-14">
                <h2 className="font-header font-bold text-2xl text-[#252638] mb-5">Portfolio</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {portfolio.map((image, index) => {
                    const shot = contentfulImage(image.url, { widths: [320, 480, 640, 960], aspect: 4 / 3 });
                    return (
                      <div
                        key={`${image.url}-${index}`}
                        className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100"
                      >
                        <img
                          src={shot.src}
                          srcSet={shot.srcSet || undefined}
                          sizes="(max-width: 640px) 50vw, 260px"
                          alt={image.description || `${fullName} portfolio ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            {achievements && achievements.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h2 className="font-header font-bold text-lg text-[#252638] mb-4">Achievements</h2>
                <ul className="flex flex-col gap-3">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                      <BadgeCheck className="w-5 h-5 text-[#FFBE00] shrink-0 mt-0.5" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {colleagues.length > 0 && (
              <div>
                <h2 className="font-header font-bold text-lg text-[#252638] mb-4">
                  Others in {academicYear}
                </h2>
                <div className="flex flex-col gap-3">
                  {colleagues.map((colleague) => (
                    <Link
                      key={colleague.sys.id}
                      href={`/executives/${executiveSlug(colleague)}`}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-black transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {colleague.officialImage?.url && (
                          <Image
                            src={ctfSrc(colleague.officialImage.url, 96)}
                            alt={colleague.fullName}
                            fill
                            className="object-cover"
                            sizes="48px"
                              unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{colleague.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {colleague.executivePositionHeld}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
};

export default ExecutiveProfile;
