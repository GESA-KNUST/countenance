'use client';

import Image from 'next/image';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import { ctfSrc } from '@/lib/contentful-src';

export interface GalleryAsset {
    sys: { id: string };
    url: string;
    title?: string | null;
    description?: string | null;
}

interface Node {
    nodeType: string;
    data?: { target?: { sys?: { id?: string } } };
}

const absolute = (url: string) => (url.startsWith('//') ? `https:${url}` : url);

const Gallery = ({ assets }: { assets: GalleryAsset[] }) => {
    if (assets.length === 1) {
        const only = assets[0];
        return (
            <figure className="my-8 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                    src={ctfSrc(absolute(only.url), 1200)}
                    alt={only.description || only.title || ''}
                    width={1200}
                    height={800}
                    className="h-auto w-full object-cover"
                    unoptimized
                />
            </figure>
        );
    }

    const columns = assets.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={`my-8 grid grid-cols-1 gap-3 ${columns}`}>
            {assets.map((asset, index) => (
                <figure
                    key={`${asset.sys.id}-${index}`}
                    className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                >
                    <Image
                        src={ctfSrc(absolute(asset.url), 640, { height: 480 })}
                        alt={asset.description || asset.title || ''}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        unoptimized
                    />
                </figure>
            ))}
        </div>
    );
};

/**
 * Renders rich text, but collects runs of images that sit next to each other
 * into one grid. Left alone they stack full width, so a body with seven in a
 * row reads as a long ribbon of pictures with no text in sight.
 */
const RichTextGallery = ({
    document: doc,
    assets,
    options,
}: {
    document: Document;
    assets: GalleryAsset[];
    options: Options;
}) => {
    const nodes = (doc.content ?? []) as unknown as Node[];
    const segments: ({ kind: 'text'; nodes: Node[] } | { kind: 'images'; assets: GalleryAsset[] })[] = [];

    for (const node of nodes) {
        const isImage = node.nodeType === BLOCKS.EMBEDDED_ASSET;
        const asset = isImage
            ? assets.find((item) => item?.sys?.id === node.data?.target?.sys?.id)
            : undefined;

        if (isImage && asset) {
            const last = segments[segments.length - 1];
            if (last && last.kind === 'images') last.assets.push(asset);
            else segments.push({ kind: 'images', assets: [asset] });
        } else {
            const last = segments[segments.length - 1];
            if (last && last.kind === 'text') last.nodes.push(node);
            else segments.push({ kind: 'text', nodes: [node] });
        }
    }

    return (
        <>
            {segments.map((segment, index) =>
                segment.kind === 'images' ? (
                    <Gallery key={`gallery-${index}`} assets={segment.assets} />
                ) : (
                    <div key={`text-${index}`}>
                        {documentToReactComponents(
                            { ...doc, content: segment.nodes } as unknown as Document,
                            options
                        )}
                    </div>
                )
            )}
        </>
    );
};

export default RichTextGallery;
