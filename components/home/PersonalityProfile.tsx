import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import { ArrowLeft, Linkedin, Star } from 'lucide-react';
import Container from '../custom/Container';
import { proseRichTextOptions } from '@/lib/richTextOptions';
import { contentfulImage } from '@/lib/contentful-image';
import type { POTWItem } from '@/hooks/usePOTW';

const PersonalityProfile = ({ person }: { person: POTWItem }) => {
    const name = person.name ?? 'Personality of the week';
    const portrait = person.image?.url
        ? contentfulImage(person.image.url, {
            widths: [480, 640, 960],
            aspect: 4 / 5,
            focus: 'face',
        })
        : null;

    return (
        <div className="font-poppins min-h-screen bg-white">
            <div className="relative overflow-hidden border-b border-gray-100 bg-white">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#FFBE00]/25 blur-3xl"
                />

                <Container size="xl" className="relative">
                    <Link
                        href="/#personality-of-the-week"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#252638]"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Back to the homepage
                    </Link>

                    <div className="mt-8 grid grid-cols-1 items-center gap-8 md:mt-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12">
                        <div className="relative mx-auto w-full max-w-[260px] md:mx-0 md:max-w-none">
                            <div
                                aria-hidden
                                className="absolute -bottom-3 -right-3 h-24 w-24 rounded-2xl bg-[#FFBE00] md:-bottom-4 md:-right-4 md:h-28 md:w-28"
                            />
                            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-xl ring-1 ring-black/5">
                                {portrait && (
                                    <img
                                        src={portrait.src}
                                        srcSet={portrait.srcSet || undefined}
                                        sizes="(max-width: 768px) 260px, 300px"
                                        alt={person.image?.title || name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <Star className="h-3.5 w-3.5 text-[#FFBE00]" fill="#FFBE00" />
                                <p className="font-header text-xs font-bold uppercase tracking-[0.2em] text-[#B88900]">
                                    Personality of the week
                                </p>
                            </div>

                            <h1 className="mt-4 font-header text-4xl font-bold leading-[1.05] tracking-tight text-[#252638] sm:text-5xl">
                                {name}
                            </h1>

                            {person.role && <p className="mt-3 text-lg text-gray-600">{person.role}</p>}

                            {person.linkedinUrl && (
                                <a
                                    href={person.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-[#252638] hover:bg-[#252638] hover:text-white"
                                >
                                    <Linkedin className="h-4 w-4" />
                                    View LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            <Container size="lg">
                {person.description?.json ? (
                    documentToReactComponents(
                        person.description.json as Document,
                        proseRichTextOptions(person.description.links?.assets?.block ?? [])
                    )
                ) : (
                    <p className="text-gray-500">Their story has not been added yet.</p>
                )}
            </Container>
        </div>
    );
};

export default PersonalityProfile;
