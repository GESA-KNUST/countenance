'use client';
import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Link2,
    Minus,
    Eye,
    Pencil,
    ImagePlus,
    ChevronUp,
    ChevronDown,
    X,
} from 'lucide-react';
import { MAX_ORIGINAL_BYTES, resizeForHero } from '@/lib/admin/resize';
import { ASSET_LINE, IMAGE_LINE, type Block, nextKey, parseBlocks, serializeBlocks } from '@/lib/admin/markdown-blocks';

const thumbUrl = (url: string) => (url.startsWith('//') ? `https:${url}` : url);

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    assetUrls: Record<string, string>;
    onAssetUploaded: (id: string, url: string) => void;
    onError: (message: string) => void;
    allowImages?: boolean;
    uploadPath?: string;
}

type Action =
    | { kind: 'wrap'; before: string; after: string; placeholder: string }
    | { kind: 'line'; prefix: string; placeholder: string }
    | { kind: 'numbered'; placeholder: string }
    | { kind: 'link' }
    | { kind: 'divider' };

const TOOLS: { label: string; Icon: typeof Bold; action: Action }[] = [
    { label: 'Bold', Icon: Bold, action: { kind: 'wrap', before: '**', after: '**', placeholder: 'bold text' } },
    { label: 'Italic', Icon: Italic, action: { kind: 'wrap', before: '_', after: '_', placeholder: 'italic text' } },
    { label: 'Big heading', Icon: Heading2, action: { kind: 'line', prefix: '## ', placeholder: 'Heading' } },
    { label: 'Small heading', Icon: Heading3, action: { kind: 'line', prefix: '### ', placeholder: 'Heading' } },
    { label: 'Bullet list', Icon: List, action: { kind: 'line', prefix: '- ', placeholder: 'List item' } },
    { label: 'Numbered list', Icon: ListOrdered, action: { kind: 'numbered', placeholder: 'List item' } },
    { label: 'Quote', Icon: Quote, action: { kind: 'line', prefix: '> ', placeholder: 'Quote' } },
    { label: 'Link', Icon: Link2, action: { kind: 'link' } },
    { label: 'Divider', Icon: Minus, action: { kind: 'divider' } },
];

const MarkdownEditor = ({
    value,
    onChange,
    rows = 12,
    assetUrls,
    onAssetUploaded,
    onError,
    allowImages = true,
    uploadPath = '/api/admin/upload',
}: MarkdownEditorProps) => {
    const [blocks, setBlocks] = useState<Block[]>(() => parseBlocks(value));
    const [preview, setPreview] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeBlock, setActiveBlock] = useState(0);

    const emitted = useRef(value);
    const areas = useRef(new Map<number, HTMLTextAreaElement>());

    useEffect(() => {
        if (value === emitted.current) return;
        emitted.current = value;
        setBlocks(parseBlocks(value));
    }, [value]);

    const commit = (next: Block[]) => {
        setBlocks(next);
        const markdown = serializeBlocks(next);
        emitted.current = markdown;
        onChange(markdown);
    };

    const setText = (key: number, text: string) => {
        commit(blocks.map((block) => (block.kind === 'text' && block.key === key ? { ...block, text } : block)));
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= blocks.length) return;
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        commit(next);
    };

    const removeBlock = (index: number) => {
        const next = blocks.filter((_, i) => i !== index);
        commit(next.length > 0 ? next : [{ key: nextKey(), kind: 'text', text: '' }]);
    };

    const apply = (action: Action) => {
        const block = blocks[activeBlock] ?? blocks.find((candidate) => candidate.kind === 'text');
        if (!block || block.kind !== 'text') return;

        const element = areas.current.get(block.key);
        const text = block.text;
        const start = element ? element.selectionStart : text.length;
        const end = element ? element.selectionEnd : text.length;
        const selected = text.slice(start, end);

        let replacement = '';
        let cursorStart = start;
        let cursorEnd = end;

        if (action.kind === 'wrap') {
            const inner = selected || action.placeholder;
            replacement = `${action.before}${inner}${action.after}`;
            cursorStart = start + action.before.length;
            cursorEnd = cursorStart + inner.length;
        } else if (action.kind === 'line' || action.kind === 'numbered') {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            const body = selected || action.placeholder;
            const prefixed = body
                .split('\n')
                .map((line, index) =>
                    action.kind === 'numbered' ? `${index + 1}. ${line}` : `${action.prefix}${line}`
                )
                .join('\n');
            const needsBreak = lineStart === start && start > 0 && text[start - 1] !== '\n';
            replacement = `${needsBreak ? '\n' : ''}${prefixed}`;
            cursorStart = start + replacement.length - body.length;
            cursorEnd = cursorStart + body.length;
        } else if (action.kind === 'link') {
            const inner = selected || 'link text';
            replacement = `[${inner}](https://)`;
            cursorStart = start + inner.length + 4;
            cursorEnd = cursorStart + 8;
        } else {
            const needsBreak = start > 0 && text[start - 1] !== '\n';
            replacement = `${needsBreak ? '\n' : ''}\n---\n`;
            cursorStart = start + replacement.length;
            cursorEnd = cursorStart;
        }

        setText(block.key, text.slice(0, start) + replacement + text.slice(end));

        requestAnimationFrame(() => {
            const area = areas.current.get(block.key);
            if (!area) return;
            area.focus();
            area.setSelectionRange(cursorStart, cursorEnd);
        });
    };

    const addImage = async (file: File | null | undefined) => {
        if (!file) return;
        onError('');

        if (!file.type.startsWith('image/')) {
            onError(`"${file.name}" is not a photo.`);
            return;
        }
        if (file.size > MAX_ORIGINAL_BYTES) {
            onError(`"${file.name}" is too big. Please pick a smaller photo.`);
            return;
        }

        setUploading(true);
        try {
            const resized = await resizeForHero(file);
            const body = new FormData();
            body.append('file', resized);

            const res = await fetch(uploadPath, { method: 'POST', body });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload.message ?? 'That photo could not be added.');
            }

            const asset = await res.json();
            onAssetUploaded(asset.id, asset.url);

            const at = Math.min(activeBlock + 1, blocks.length);
            const next = [...blocks];
            next.splice(at, 0, { key: nextKey(), kind: 'image', id: asset.id });
            if (!next.some((block, index) => index > at && block.kind === 'text')) {
                next.push({ key: nextKey(), kind: 'text', text: '' });
            }
            commit(next);
        } catch (error) {
            onError(error instanceof Error ? error.message : 'That photo could not be added.');
        }
        setUploading(false);
    };

    return (
        <div className="rounded-lg border border-gray-300 bg-white overflow-hidden">
            <div className="flex items-center gap-0.5 flex-wrap border-b border-gray-200 bg-gray-50 px-2 py-1.5">
                {TOOLS.map(({ label, Icon, action }) => (
                    <button
                        key={label}
                        type="button"
                        title={label}
                        aria-label={label}
                        disabled={preview}
                        onClick={() => apply(action)}
                        className="p-2 rounded-md hover:bg-white hover:shadow-sm text-gray-600 hover:text-black cursor-pointer disabled:opacity-30 disabled:cursor-default"
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                ))}

                {allowImages && (
                <label
                    title="Add a photo"
                    aria-label="Add a photo"
                    className={`p-2 rounded-md hover:bg-white hover:shadow-sm text-gray-600 hover:text-black ${
                        preview || uploading ? 'opacity-30' : 'cursor-pointer'
                    }`}
                >
                    <ImagePlus className="w-4 h-4" />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={preview || uploading}
                        onChange={(event) => {
                            addImage(event.target.files?.[0]);
                            event.target.value = '';
                        }}
                    />
                </label>
                )}

                {uploading && <span className="text-xs text-gray-500 px-2">Adding photo...</span>}

                <button
                    type="button"
                    onClick={() => setPreview((current) => !current)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-white hover:shadow-sm hover:text-black cursor-pointer"
                >
                    {preview ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {preview ? 'Write' : 'Preview'}
                </button>
            </div>

            {preview ? (
                <div className="px-4 py-3 min-h-40 text-[15px] leading-relaxed">
                    <MarkdownPreview source={value} assetUrls={assetUrls} />
                </div>
            ) : (
                <div className="flex flex-col divide-y divide-gray-100">
                    {value.includes('\\') && (
                        <p className="px-4 py-2 text-xs text-gray-500 bg-amber-50/60">
                            A backslash before a character (like <code>\\*</code>) just means &ldquo;show
                            this character as-is&rdquo;. Leave them in place and they will not appear on the website.
                        </p>
                    )}
                    {blocks.map((block, index) =>
                        block.kind === 'text' ? (
                            <textarea
                                key={block.key}
                                ref={(element) => {
                                    if (element) areas.current.set(block.key, element);
                                    else areas.current.delete(block.key);
                                }}
                                value={block.text}
                                onChange={(event) => setText(block.key, event.target.value)}
                                onFocus={() => setActiveBlock(index)}
                                rows={Math.max(3, Math.min(rows, block.text.split('\n').length + 1))}
                                placeholder={blocks.length === 1 ? 'Write here...' : undefined}
                                className="w-full px-4 py-3 text-base outline-none resize-y leading-relaxed"
                            />
                        ) : (
                            <div key={block.key} className="p-3 bg-gray-50/60">
                                <div className="flex items-start gap-3">
                                    <span className="relative block w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                        {assetUrls[block.id] || block.url ? (
                                            <NextImage
                                                src={`${thumbUrl(assetUrls[block.id] || block.url || '')}?w=256&h=192&fit=fill&fm=jpg&q=70`}
                                                alt=""
                                                fill
                                                className="object-cover"
                                                sizes="128px"
                                                unoptimized
                                            />
                                        ) : (
                                            <span className="absolute inset-0 grid place-items-center text-xs text-gray-500">
                                                Photo
                                            </span>
                                        )}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium">Photo in the article</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            It appears here, between the text above and below.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-0.5 shrink-0">
                                        <button
                                            type="button"
                                            aria-label="Move photo up"
                                            onClick={() => moveBlock(index, -1)}
                                            disabled={index === 0}
                                            className="p-1.5 rounded-md hover:bg-white disabled:opacity-25 cursor-pointer"
                                        >
                                            <ChevronUp className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Move photo down"
                                            onClick={() => moveBlock(index, 1)}
                                            disabled={index === blocks.length - 1}
                                            className="p-1.5 rounded-md hover:bg-white disabled:opacity-25 cursor-pointer"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Remove photo"
                                            onClick={() => removeBlock(index)}
                                            className="p-1.5 rounded-md hover:bg-white cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

const inline = (text: string) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="underline decoration-[#FFBE00] decoration-2">$1</span>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 rounded px-1">$1</code>');

const MarkdownPreview = ({
    source,
    assetUrls,
}: {
    source: string;
    assetUrls: Record<string, string>;
}) => {
    if (!source.trim()) {
        return <p className="text-gray-400">Nothing written yet.</p>;
    }

    const blocks: React.ReactNode[] = [];
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    let index = 0;
    let key = 0;

    while (index < lines.length) {
        const line = lines[index].trim();

        if (line === '') {
            index += 1;
            continue;
        }

        const assetLine = line.match(ASSET_LINE);
        const directLine = assetLine ? null : line.match(IMAGE_LINE);
        if (assetLine || directLine) {
            const url = assetLine ? assetUrls[assetLine[2]] : thumbUrl(directLine![2]);
            blocks.push(
                url ? (
                    <span key={key++} className="block relative w-full max-w-sm aspect-4/3 my-4 rounded-lg overflow-hidden bg-gray-100">
                        <NextImage
                            src={`${url}?w=640&h=480&fit=fill&fm=jpg&q=70`}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="384px"
                            unoptimized
                        />
                    </span>
                ) : (
                    <span key={key++} className="block text-sm text-gray-400 my-3">Photo</span>
                )
            );
            index += 1;
            continue;
        }

        if (/^-{3,}$/.test(line)) {
            blocks.push(<hr key={key++} className="my-4 border-gray-200" />);
            index += 1;
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            const size = heading[1].length <= 2 ? 'text-xl' : 'text-lg';
            blocks.push(
                <p
                    key={key++}
                    className={`${size} font-bold font-header text-[#252638] mt-4 mb-2`}
                    dangerouslySetInnerHTML={{ __html: inline(heading[2]) }}
                />
            );
            index += 1;
            continue;
        }

        if (/^>\s?/.test(line)) {
            const quoted: string[] = [];
            while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
                quoted.push(lines[index].trim().replace(/^>\s?/, ''));
                index += 1;
            }
            blocks.push(
                <blockquote
                    key={key++}
                    className="border-l-4 border-[#FFBE00] pl-3 italic text-gray-600 my-3"
                    dangerouslySetInnerHTML={{ __html: inline(quoted.join(' ')) }}
                />
            );
            continue;
        }

        const bullet = /^[-*+]\s+(.*)$/;
        const numbered = /^\d+[.)]\s+(.*)$/;

        if (bullet.test(line) || numbered.test(line)) {
            const ordered = numbered.test(line);
            const pattern = ordered ? numbered : bullet;
            const items: string[] = [];

            while (index < lines.length) {
                const match = lines[index].trim().match(pattern);
                if (!match) break;
                items.push(match[1]);
                index += 1;
            }

            const ListTag = ordered ? 'ol' : 'ul';
            blocks.push(
                <ListTag
                    key={key++}
                    className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 my-3 flex flex-col gap-1`}
                >
                    {items.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: inline(item) }} />
                    ))}
                </ListTag>
            );
            continue;
        }

        const paragraph: string[] = [];
        while (index < lines.length && lines[index].trim() !== '') {
            const candidate = lines[index].trim();
            if (
                /^#{1,6}\s/.test(candidate) ||
                /^>\s?/.test(candidate) ||
                bullet.test(candidate) ||
                numbered.test(candidate) ||
                /^-{3,}$/.test(candidate)
            ) {
                break;
            }
            paragraph.push(candidate);
            index += 1;
        }
        blocks.push(
            <p
                key={key++}
                className="mb-3 text-gray-700"
                dangerouslySetInnerHTML={{ __html: inline(paragraph.join(' ')) }}
            />
        );
    }

    return <>{blocks}</>;
};

export default MarkdownEditor;
