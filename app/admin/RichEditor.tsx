'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
    ImagePlus,
    Trash2,
} from 'lucide-react';
import {
    EditorContent,
    Node,
    NodeViewWrapper,
    ReactNodeViewRenderer,
    useEditor,
    type NodeViewProps,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import { MAX_ORIGINAL_BYTES, resizeForHero } from '@/lib/admin/resize';
import { documentToMarkdown, markdownToDocument } from '@/lib/admin/richtext';
import { ASSET_IMAGE, documentToTipTap, tipTapToDocument, type TipTapDoc } from '@/lib/admin/tiptap-document';

const thumbUrl = (url: string) => (url.startsWith('//') ? `https:${url}` : url);

const AssetUrls = createContext<Record<string, string>>({});

type CaptionState = 'loading' | 'idle' | 'saving' | 'saved' | 'error';

const PhotoCaption = ({ assetId }: { assetId: string }) => {
    const [name, setName] = useState('');
    const [caption, setCaption] = useState('');
    const [state, setState] = useState<CaptionState>('loading');
    const saved = useRef({ name: '', caption: '' });

    useEffect(() => {
        if (!assetId) return;
        let cancelled = false;
        fetch(`/api/admin/asset-caption?id=${encodeURIComponent(assetId)}`)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data: { name: string; caption: string }) => {
                if (cancelled) return;
                saved.current = data;
                setName(data.name);
                setCaption(data.caption);
                setState('idle');
            })
            .catch(() => !cancelled && setState('idle'));
        return () => {
            cancelled = true;
        };
    }, [assetId]);

    const save = async () => {
        const next = { name: name.trim(), caption: caption.trim() };
        if (next.name === saved.current.name && next.caption === saved.current.caption) return;
        setState('saving');
        try {
            const res = await fetch('/api/admin/asset-caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: assetId, ...next }),
            });
            if (!res.ok) throw new Error();
            saved.current = next;
            setState('saved');
        } catch {
            setState('error');
        }
    };

    const field =
        'w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-black disabled:bg-gray-50';

    return (
        <span className="block space-y-1.5 border-t border-gray-100 bg-white p-2.5" contentEditable={false}>
            <input
                className={field}
                placeholder="Name (for a person's photo)"
                value={name}
                maxLength={120}
                disabled={state === 'loading'}
                onChange={(event) => setName(event.target.value)}
                onBlur={save}
                onKeyDown={(event) => event.stopPropagation()}
            />
            <input
                className={field}
                placeholder="Role or caption, e.g. President"
                value={caption}
                maxLength={300}
                disabled={state === 'loading'}
                onChange={(event) => setCaption(event.target.value)}
                onBlur={save}
                onKeyDown={(event) => event.stopPropagation()}
            />
            <span className="block text-xs text-gray-500">
                {state === 'saving' && 'Saving...'}
                {state === 'saved' && 'Saved.'}
                {state === 'error' && <span className="text-red-700">Could not save. Try again.</span>}
                {(state === 'idle' || state === 'loading') &&
                    'Photos placed one after another show as a grid. Add a name and role to show them as a team.'}
            </span>
        </span>
    );
};

const AssetImageView = ({ node, deleteNode, selected }: NodeViewProps) => {
    const urls = useContext(AssetUrls);
    const id = node.attrs.assetId as string;
    const url = urls[id];

    return (
        <NodeViewWrapper
            className={`relative my-4 inline-block w-full max-w-sm overflow-hidden rounded-xl border-2 ${
                selected ? 'border-[#FFBE00]' : 'border-gray-200'
            }`}
            data-drag-handle
        >
            <span className="relative block aspect-4/3 w-full bg-gray-100">
                {url ? (
                    <NextImage
                        src={`${thumbUrl(url)}?w=640&h=480&fit=fill&fm=jpg&q=70`}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="384px"
                        unoptimized
                    />
                ) : (
                    <span className="absolute inset-0 grid place-items-center text-sm text-gray-500">
                        Photo
                    </span>
                )}
            </span>

            <PhotoCaption assetId={id} />

            <button
                type="button"
                onClick={() => deleteNode()}
                aria-label="Remove this photo"
                title="Remove this photo"
                className="absolute right-2 top-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-red-700 shadow-sm hover:bg-white"
            >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
            </button>
        </NodeViewWrapper>
    );
};

const AssetImage = Node.create({
    name: ASSET_IMAGE,
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes: () => ({ assetId: { default: '' } }),
    parseHTML: () => [{ tag: 'div[data-asset-id]' }],
    renderHTML: ({ HTMLAttributes }) => [
        'div',
        { 'data-asset-id': HTMLAttributes.assetId as string },
    ],
    addNodeView: () =>
        ReactNodeViewRenderer(AssetImageView, {
            stopEvent: ({ event }) => event.target instanceof HTMLInputElement,
        }),
});

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    assetUrls: Record<string, string>;
    onAssetUploaded: (id: string, url: string) => void;
    onError: (message: string) => void;
    allowImages?: boolean;
    uploadPath?: string;
    placeholder?: string;
}

const toMarkdown = (doc: TipTapDoc) => documentToMarkdown(tipTapToDocument(doc));
const toEditorDoc = (markdown: string) => documentToTipTap(markdownToDocument(markdown));

const RichEditor = ({
    value,
    onChange,
    rows = 8,
    assetUrls,
    onAssetUploaded,
    onError,
    allowImages = true,
    uploadPath = '/api/admin/upload',
    placeholder = 'Write here...',
}: RichEditorProps) => {
    const [uploading, setUploading] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkWords, setLinkWords] = useState('');
    const [linkAddress, setLinkAddress] = useState('');

    const emitted = useRef(value);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                strike: false,
                hardBreak: false,
                heading: { levels: [1, 2, 3, 4, 5, 6] },
                link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: 'noreferrer' } },
            }),
            AssetImage,
            Placeholder.configure({ placeholder }),
        ],
        content: toEditorDoc(value),
        editorProps: {
            attributes: {
                class: 'admin-prose outline-none px-4 py-3',
                style: `min-height: ${Math.max(6, rows) * 1.6}rem`,
            },
        },
        onUpdate: ({ editor: instance }) => {
            const markdown = toMarkdown(instance.getJSON() as TipTapDoc);
            emitted.current = markdown;
            onChange(markdown);
        },
    });

    useEffect(() => {
        if (!editor || value === emitted.current) return;
        emitted.current = value;
        editor.commands.setContent(toEditorDoc(value), { emitUpdate: false });
    }, [editor, value]);

    if (!editor) return null;

    const openLink = () => {
        const { from, to } = editor.state.selection;
        setLinkWords(editor.state.doc.textBetween(from, to, ' '));
        setLinkAddress((editor.getAttributes('link').href as string) ?? '');
        setLinkOpen(true);
    };

    const applyLink = () => {
        const address = linkAddress.trim();
        if (!address) return;

        const href = /^(https?:|mailto:|tel:|\/|#)/i.test(address) ? address : `https://${address}`;
        const { from, to, empty } = editor.state.selection;
        const selected = editor.state.doc.textBetween(from, to, ' ');
        const words = linkWords.trim();
        const linked = (text: string) => [
            { type: 'text', text, marks: [{ type: 'link', attrs: { href } }] },
        ];

        if (empty) {
            editor.chain().focus().insertContent(linked(words || address)).run();
        } else if (words && words !== selected) {
            editor.chain().focus().insertContent(linked(words)).run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        }

        setLinkOpen(false);
    };

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setLinkOpen(false);
    };

    const addPhoto = async (file: File | null | undefined) => {
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
            const body = new FormData();
            body.append('file', await resizeForHero(file));

            const res = await fetch(uploadPath, { method: 'POST', body });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload.message ?? 'That photo could not be added.');
            }

            const asset = await res.json();
            onAssetUploaded(asset.id, asset.url);
            editor
                .chain()
                .focus()
                .insertContent({ type: ASSET_IMAGE, attrs: { assetId: asset.id } })
                .run();
        } catch (error) {
            onError(error instanceof Error ? error.message : 'That photo could not be added.');
        }
        setUploading(false);
    };

    return (
        <AssetUrls.Provider value={assetUrls}>
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-black">
                <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
                    <Tool
                        label="Bold"
                        Icon={Bold}
                        active={editor.isActive('bold')}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    />
                    <Tool
                        label="Italic"
                        Icon={Italic}
                        active={editor.isActive('italic')}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    />
                    <Tool
                        label="Heading"
                        Icon={Heading2}
                        active={editor.isActive('heading', { level: 2 })}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    />
                    <Tool
                        label="Smaller heading"
                        Icon={Heading3}
                        active={editor.isActive('heading', { level: 3 })}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    />
                    <Tool
                        label="Bullet list"
                        Icon={List}
                        active={editor.isActive('bulletList')}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    />
                    <Tool
                        label="Numbered list"
                        Icon={ListOrdered}
                        active={editor.isActive('orderedList')}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    />
                    <Tool
                        label="Quote"
                        Icon={Quote}
                        active={editor.isActive('blockquote')}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    />
                    <Tool label="Link" Icon={Link2} active={editor.isActive('link')} onClick={openLink} />
                    <Tool
                        label="Line"
                        Icon={Minus}
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    />

                    {allowImages && (
                        <label
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white hover:text-black hover:shadow-sm ${
                                uploading ? 'opacity-40' : 'cursor-pointer'
                            }`}
                        >
                            <ImagePlus className="h-4 w-4" />
                            {uploading ? 'Adding photo...' : 'Photo'}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploading}
                                onChange={(event) => {
                                    addPhoto(event.target.files?.[0]);
                                    event.target.value = '';
                                }}
                            />
                        </label>
                    )}
                </div>

                {linkOpen && (
                    <div className="flex flex-col gap-2 border-b border-gray-200 bg-amber-50/60 px-4 py-3">
                        <label className="text-xs font-semibold text-gray-700">
                            Words people will see
                            <input
                                type="text"
                                value={linkWords}
                                onChange={(event) => setLinkWords(event.target.value)}
                                placeholder="Read the handbook"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal outline-none focus:border-black"
                            />
                        </label>
                        <label className="text-xs font-semibold text-gray-700">
                            Web address
                            <input
                                type="text"
                                value={linkAddress}
                                onChange={(event) => setLinkAddress(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        applyLink();
                                    }
                                }}
                                placeholder="gesaknust.com/handbook"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal outline-none focus:border-black"
                            />
                        </label>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={applyLink}
                                disabled={linkAddress.trim() === ''}
                                className="cursor-pointer rounded-lg bg-black px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-40"
                            >
                                Add link
                            </button>
                            {editor.isActive('link') && (
                                <button
                                    type="button"
                                    onClick={removeLink}
                                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:border-black"
                                >
                                    Remove link
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setLinkOpen(false)}
                                className="cursor-pointer rounded-lg px-2 py-2 text-xs font-semibold text-gray-500 hover:text-black"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <EditorContent editor={editor} />
            </div>
        </AssetUrls.Provider>
    );
};

const Tool = ({
    label,
    Icon,
    active,
    onClick,
}: {
    label: string;
    Icon: typeof Bold;
    active?: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold hover:bg-white hover:shadow-sm ${
            active ? 'bg-white text-black shadow-sm' : 'text-gray-700 hover:text-black'
        }`}
    >
        <Icon className="h-4 w-4" />
        {label}
    </button>
);

export default RichEditor;
