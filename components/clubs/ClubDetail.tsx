'use client';

import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, type TopLevelBlock } from '@contentful/rich-text-types';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { ClubItems } from '@/hooks/useClubs';
import Container from '../custom/Container';
import { proseRichTextOptions, type EmbeddedAsset } from '@/lib/richTextOptions';
import { contentfulImage } from '@/lib/contentful-image';
import ClubLogo from './ClubLogo';

import { useStore } from '@/store/useStore';
import { Fragment, useEffect } from 'react';

interface ClubDetailProps {
    club: ClubItems;
}

type ContentGroup = { kind: 'nodes'; nodes: TopLevelBlock[] } | { kind: 'assets'; ids: string[] };

function groupAssetRuns(nodes: TopLevelBlock[]): ContentGroup[] {
    const groups: ContentGroup[] = [];
    for (const node of nodes) {
        const id = node.nodeType === BLOCKS.EMBEDDED_ASSET ? node.data?.target?.sys?.id : undefined;
        const last = groups[groups.length - 1];
        if (id) {
            if (last?.kind === 'assets') last.ids.push(id);
            else groups.push({ kind: 'assets', ids: [id] });
        } else if (last?.kind === 'nodes') {
            last.nodes.push(node);
        } else {
            groups.push({ kind: 'nodes', nodes: [node] });
        }
    }
    return groups;
}

interface AssetGridProps {
    ids: string[];
    findAsset: (id: string) => EmbeddedAsset | undefined;
}

const isPortrait = (asset: EmbeddedAsset) => Boolean(asset.width && asset.height && asset.height > asset.width);

const AssetGrid = ({ ids, findAsset }: AssetGridProps) => {
    const items = ids.map(findAsset).filter((asset): asset is EmbeddedAsset => Boolean(asset?.url));
    if (items.length === 0) return null;

    const single = items.length === 1;
    const captioned = items.every((asset) => asset.description);
    const people = captioned && (!single || isPortrait(items[0]));

    if (single && !people) {
        const image = contentfulImage(items[0].url, { intrinsicWidth: items[0].width, intrinsicHeight: items[0].height });
        return (
            <figure className="my-8 w-full max-w-2xl mx-auto">
                <img
                    src={image.src}
                    srcSet={image.srcSet || undefined}
                    sizes="(max-width: 768px) 100vw, 672px"
                    alt={items[0].description || items[0].title || ''}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto rounded-2xl shadow-sm"
                />
                {items[0].description && (
                    <figcaption className="text-sm text-gray-500 text-center mt-2">{items[0].description}</figcaption>
                )}
            </figure>
        );
    }

    const aspect = people ? 4 / 5 : 4 / 3;
    const columns = people
        ? single ? 'grid-cols-1 max-w-[240px]' : 'grid-cols-2 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

    return (
        <div className={`grid ${columns} gap-4 sm:gap-5 my-8`}>
            {items.map((asset) => {
                const image = contentfulImage(asset.url, {
                    widths: [320, 480, 640, 960],
                    intrinsicWidth: asset.width,
                    aspect,
                    focus: people ? 'face' : 'center',
                });
                return (
                    <figure key={asset.sys.id} className="group">
                        <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                            <img
                                src={image.src}
                                srcSet={image.srcSet || undefined}
                                sizes={people ? '(max-width: 640px) 50vw, 240px' : '(max-width: 640px) 100vw, 360px'}
                                alt={asset.title || ''}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                style={{ aspectRatio: String(aspect) }}
                            />
                        </div>
                        {people && (
                            <figcaption className="mt-3 space-y-0.5">
                                <p className="font-header font-bold text-gray-900 text-sm sm:text-base leading-snug">{asset.title}</p>
                                {asset.description && (
                                    <p className="text-xs sm:text-sm text-gray-500 leading-snug">{asset.description}</p>
                                )}
                            </figcaption>
                        )}
                    </figure>
                );
            })}
        </div>
    );
};

interface JoinCardProps {
    clubLink: string;
    recruiting: boolean;
}

const RecruitingStatus = ({ recruiting }: { recruiting: boolean }) => (
    <p className="flex items-center gap-2 text-sm text-gray-600">
        <span className={`w-2 h-2 rounded-full ${recruiting ? 'bg-emerald-500' : 'bg-gray-300'}`} />
        {recruiting ? 'Accepting new members' : 'Recruitment currently closed'}
    </p>
);

const JoinButton = ({ clubLink, className = '' }: { clubLink: string; className?: string }) => (
    <a
        href={clubLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-gray-900 font-semibold hover:bg-[#f0b200] transition-colors ${className}`}
    >
        Join the community
        <ArrowUpRight className="w-4 h-4" />
    </a>
);

const JoinCard = ({ clubLink, recruiting }: JoinCardProps) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="font-header font-bold text-lg text-gray-900">Interested?</h2>
        <RecruitingStatus recruiting={recruiting} />
        <p className="text-sm text-gray-500">Membership is open to all GESA students.</p>
        <JoinButton clubLink={clubLink} className="w-full" />
    </div>
);

const ClubDetail: React.FC<ClubDetailProps> = ({ club }) => {
    const { clubName, clubLogo, clubType, clubLink, description, isActivelyRecruitingMembers, aboutclub, sys } = club;
    const { addToRecentlyViewed } = useStore();

    useEffect(() => {
        if (club && sys.id) {
            addToRecentlyViewed(`/clubs/${sys.id}`);
        }
    }, [club, sys.id, addToRecentlyViewed]);

    const assets = aboutclub?.links?.assets?.block ?? [];
    const options = proseRichTextOptions(assets);
    const findAsset = (id: string) => assets.find((asset) => asset.sys.id === id);

    return (
        <div className="min-h-screen bg-white sm:bg-gray-50 pb-16 font-poppins">
            <header className="bg-white border-b border-gray-100">
                <Container size="xl">
                    <div className="py-6 sm:py-10">
                        <Link
                            href="/clubs"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All clubs and societies
                        </Link>

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                            <ClubLogo
                                name={clubName}
                                url={clubLogo?.url}
                                alt={clubLogo?.title}
                                width={400}
                                className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-2xl border border-gray-200 bg-white"
                                imageClassName="p-2"
                                monogramClassName="text-xl sm:text-2xl"
                            />
                            <div className="space-y-3 min-w-0">
                                <span className="inline-block text-xs font-semibold text-gray-700 bg-primary/15 px-3 py-1 rounded-full">
                                    {clubType}
                                </span>
                                <h1 className="font-header text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
                                    {clubName}
                                </h1>
                                {description && (
                                    <p className="text-gray-600 leading-relaxed max-w-3xl">{description}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 lg:hidden">
                            <JoinButton clubLink={clubLink} />
                            <RecruitingStatus recruiting={isActivelyRecruitingMembers} />
                        </div>
                    </div>
                </Container>
            </header>

            <Container size="xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-6 sm:pt-10">
                    <article className="lg:col-span-8 text-gray-600 sm:rounded-2xl sm:border sm:border-gray-200 sm:bg-white sm:p-10 max-sm:[&_p]:!text-base max-sm:[&_ul]:!text-base max-sm:[&_ol]:!text-base max-sm:[&_ul]:pl-5 max-sm:[&_ol]:pl-5">
                        {aboutclub?.json &&
                            groupAssetRuns(aboutclub.json.content).map((group, index) =>
                                group.kind === 'assets' ? (
                                    <AssetGrid key={index} ids={group.ids} findAsset={findAsset} />
                                ) : (
                                    <Fragment key={index}>
                                        {documentToReactComponents({ ...aboutclub.json, content: group.nodes }, options)}
                                    </Fragment>
                                )
                            )}
                    </article>

                    <aside className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24">
                            <JoinCard clubLink={clubLink} recruiting={isActivelyRecruitingMembers} />
                        </div>
                    </aside>
                </div>
            </Container>
        </div>
    );
};

export default ClubDetail;
