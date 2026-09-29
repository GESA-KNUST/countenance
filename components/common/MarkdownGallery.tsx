'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { markdownComponents } from '@/lib/markdownComponents';
import { ctfSrc } from '@/lib/contentful-src';

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;

const absolute = (url: string) => (url.startsWith('//') ? `https:${url}` : url);

const Gallery = ({ images }: { images: { url: string; alt: string }[] }) => {
    if (images.length === 1) {
        return (
            <figure className="my-8 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                    src={ctfSrc(absolute(images[0].url), 1200)}
                    alt={images[0].alt}
                    width={1200}
                    height={800}
                    className="h-auto w-full object-cover"
                    unoptimized
                />
            </figure>
        );
    }

    const columns = images.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

    return (
        <div className={`my-8 grid grid-cols-1 gap-3 ${columns}`}>
            {images.map((image, index) => (
                <figure
                    key={`${image.url}-${index}`}
                    className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                >
                    <Image
                        src={ctfSrc(absolute(image.url), 640, { height: 480 })}
                        alt={image.alt}
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
 * Markdown where images that sit next to each other become one grid instead of
 * a tall stack of full width pictures.
 */
const MarkdownGallery = ({ content }: { content: string }) => {
    const segments: ({ kind: 'text'; lines: string[] } | { kind: 'images'; images: { url: string; alt: string }[] })[] = [];

    for (const line of content.replace(/\r\n/g, '\n').split('\n')) {
        const match = line.trim().match(IMAGE_LINE);
        const last = segments[segments.length - 1];

        if (match) {
            const image = { url: match[2], alt: match[1] };
            if (last && last.kind === 'images') last.images.push(image);
            else segments.push({ kind: 'images', images: [image] });
        } else {
            if (last && last.kind === 'text') last.lines.push(line);
            else segments.push({ kind: 'text', lines: [line] });
        }
    }

    return (
        <>
            {segments.map((segment, index) =>
                segment.kind === 'images' ? (
                    <Gallery key={`gallery-${index}`} images={segment.images} />
                ) : segment.lines.join('\n').trim() === '' ? null : (
                    <ReactMarkdown
                        key={`text-${index}`}
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={markdownComponents}
                    >
                        {segment.lines.join('\n')}
                    </ReactMarkdown>
                )
            )}
        </>
    );
};

export default MarkdownGallery;
