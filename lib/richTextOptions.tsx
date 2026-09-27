import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import type { Options } from '@contentful/rich-text-react-renderer';
import { contentfulImage } from './contentful-image';
import React, { ReactNode } from 'react';

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))/i;

export function safeHref(uri: unknown) {
    const value = typeof uri === 'string' ? uri.trim() : '';
    return SAFE_HREF.test(value) ? value : undefined;
}

export const richTextParagraphRenderer = {
    [INLINES.HYPERLINK]: (node: any, children: ReactNode) => {
        const href = safeHref(node?.data?.uri);
        if (!href) return <>{children}</>;
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[#252638] underline decoration-[#FFBE00] decoration-2 underline-offset-2 hover:text-black"
            >
                {children}
            </a>
        );
    },
    [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => {
        return <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>;
    },
    [BLOCKS.TABLE]: (node: any, children: ReactNode) => (
        <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse">
                <tbody className="bg-white">
                    {children}
                </tbody>
            </table>
        </div>
    ),
    [BLOCKS.TABLE_ROW]: (node: any, children: ReactNode) => (
        <tr className="hover:bg-gray-50 transition-colors">
            {children}
        </tr>
    ),
    [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: ReactNode) => (
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-r border-gray-200 last:border-r-0">
            {children}
        </th>
    ),
    [BLOCKS.TABLE_CELL]: (node: any, children: ReactNode) => (
        <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 leading-relaxed border-b border-r border-gray-200 last:border-r-0">
            {children}
        </td>
    ),
};

export interface EmbeddedAsset {
    sys: { id: string };
    url: string;
    title?: string | null;
    description?: string | null;
    width?: number | null;
    height?: number | null;
}

export function embeddedAssetRenderer(assets: EmbeddedAsset[]) {
    function EmbeddedAssetBlock(node: any) {
        const assetId = node?.data?.target?.sys?.id;
        const asset = assets.find((candidate) => candidate.sys.id === assetId);
        if (!asset?.url) return null;

        const image = contentfulImage(asset.url, {
            intrinsicWidth: asset.width,
            intrinsicHeight: asset.height,
        });

        return (
            <figure className="my-8 w-full max-w-2xl mx-auto">
                <img
                    src={image.src}
                    srcSet={image.srcSet || undefined}
                    sizes="(max-width: 768px) 100vw, 672px"
                    alt={asset.description || asset.title || ''}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto rounded-2xl shadow-sm"
                />
                {asset.description && (
                    <figcaption className="text-sm text-gray-500 text-center mt-2">
                        {asset.description}
                    </figcaption>
                )}
            </figure>
        );
    }

    return EmbeddedAssetBlock;
}

export const proseRichTextOptions = (assets: EmbeddedAsset[] = []): Options => ({
    renderNode: {
        ...richTextParagraphRenderer,
        [BLOCKS.EMBEDDED_ASSET]: embeddedAssetRenderer(assets),
        [BLOCKS.HEADING_1]: (node: any, children: ReactNode) => (
            <h2 className="font-header font-bold text-3xl text-[#252638] mt-10 mb-4">{children}</h2>
        ),
        [BLOCKS.HEADING_2]: (node: any, children: ReactNode) => (
            <h2 className="font-header font-bold text-2xl text-[#252638] mt-10 mb-4">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: any, children: ReactNode) => (
            <h3 className="font-header font-bold text-xl text-[#252638] mt-8 mb-3">{children}</h3>
        ),
        [BLOCKS.HEADING_4]: (node: any, children: ReactNode) => (
            <h4 className="font-header font-semibold text-lg text-[#252638] mt-6 mb-2">{children}</h4>
        ),
        [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
            <ul className="list-disc pl-6 mb-6 flex flex-col gap-2 text-gray-700 text-lg">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: ReactNode) => (
            <ol className="list-decimal pl-6 mb-6 flex flex-col gap-2 text-gray-700 text-lg">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
            <li className="leading-relaxed [&>p]:mb-0">{children}</li>
        ),
        [BLOCKS.QUOTE]: (node: any, children: ReactNode) => (
            <blockquote className="border-l-4 border-[#FFBE00] bg-[#FFBE00]/5 rounded-r-lg pl-5 pr-4 py-3 my-6 italic text-gray-700 [&>p]:mb-0">
                {children}
            </blockquote>
        ),
        [BLOCKS.HR]: () => <hr className="my-10 border-gray-200" />,
    },
    renderMark: {
        [MARKS.BOLD]: (text: ReactNode) => <strong className="font-semibold">{text}</strong>,
        [MARKS.ITALIC]: (text: ReactNode) => <em className="italic">{text}</em>,
        [MARKS.UNDERLINE]: (text: ReactNode) => <u>{text}</u>,
        [MARKS.CODE]: (text: ReactNode) => (
            <code className="bg-gray-100 rounded px-1.5 py-0.5 text-[0.9em] font-mono">{text}</code>
        ),
    },
});
