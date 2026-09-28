'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, Plus, X, Send } from 'lucide-react';
import StarSpinner from '@/components/ui/StarSpinner';
import MarkdownEditor from '@/app/admin/MarkdownEditor';
import { MAX_ORIGINAL_BYTES, resizeForHero } from '@/lib/admin/resize';
import type { Writer } from '@/lib/contribute/session';

const labelClass = 'block font-semibold mb-1';
const inputClass =
    'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none focus:border-black';

const ContributeForm = ({
    writer,
    savedPhotoUrl,
}: {
    writer: Writer;
    savedPhotoUrl: string | null;
}) => {
    const router = useRouter();
    const [photoUrl, setPhotoUrl] = useState(savedPhotoUrl);
    const [photoBusy, setPhotoBusy] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const [title, setTitle] = useState('');
    const [hook, setHook] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagDraft, setTagDraft] = useState('');
    const [cover, setCover] = useState<{ id: string; url: string } | null>(null);
    const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
    const [website, setWebsite] = useState('');

    const [busy, setBusy] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const uploadCover = async (file: File | null | undefined) => {
        if (!file) return;
        setError('');

        if (!file.type.startsWith('image/')) {
            setError(`"${file.name}" is not a photo.`);
            return;
        }
        if (file.size > MAX_ORIGINAL_BYTES) {
            setError('That photo is too big. Please pick a smaller one.');
            return;
        }

        setBusy('Adding your cover photo...');
        try {
            const resized = await resizeForHero(file);
            const form = new FormData();
            form.append('file', resized);
            const res = await fetch('/api/contribute/upload', { method: 'POST', body: form });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload.message ?? 'That photo could not be added.');
            }
            const asset = await res.json();
            setCover({ id: asset.id, url: asset.url });
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'That photo could not be added.');
        }
        setBusy('');
    };

    const addTag = () => {
        const value = tagDraft.trim();
        if (!value || tags.includes(value) || tags.length >= 8) return;
        setTags([...tags, value]);
        setTagDraft('');
    };

    const choosePhoto = async (file: File) => {
        setPhotoError('');
        setPhotoBusy(true);
        try {
            const resized = await resizeForHero(file);
            const form = new FormData();
            form.append('file', resized);

            const res = await fetch('/api/contribute/photo', { method: 'POST', body: form });
            const payload = await res.json().catch(() => ({}));

            if (!res.ok) {
                setPhotoError(payload.message ?? 'That photo could not be saved.');
            } else {
                setPhotoUrl(payload.url);
            }
        } catch {
            setPhotoError('That photo could not be saved.');
        }
        setPhotoBusy(false);
    };

    const signOut = async () => {
        await fetch('/api/contribute/auth/logout', { method: 'POST' });
        router.refresh();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSending(true);

        try {
            const res = await fetch('/api/contribute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    hook,
                    body,
                    coverImage: cover?.id ?? '',
                    tags,
                    website,
                }),
            });

            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(payload.message ?? 'Your article could not be sent.');
                setSending(false);
                return;
            }

            setSent(true);
        } catch {
            setError('No internet connection. Your article was not sent.');
        }
        setSending(false);
    };

    if (sent) {
        return (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                <Check className="w-10 h-10 text-green-700 mx-auto mb-4" />
                <h2 className="font-header font-bold text-2xl text-[#252638] mb-2">
                    Thank you, {(writer.name || writer.email).split(' ')[0]}!
                </h2>
                <p className="text-gray-700">
                    Your article has been sent to the GESA team for review. Nothing is published yet
                    &mdash; someone will read it and get back to you at {writer.email}.
                </p>
            </div>
        );
    }

    const canSend =
        title.trim() !== '' &&
        hook.trim() !== '' &&
        body.trim() !== '' &&
        cover !== null;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
                <label htmlFor="c-title" className={labelClass}>
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="c-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={160}
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="c-hook" className={labelClass}>
                    Short summary <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">One line that makes people want to read it.</p>
                <input
                    id="c-hook"
                    value={hook}
                    onChange={(event) => setHook(event.target.value)}
                    maxLength={300}
                    className={inputClass}
                />
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-4">
                    <label className="group relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-full bg-[#252638]">
                        {photoUrl ? (
                            <Image
                                src={`${photoUrl}?w=112&h=112&fit=fill&f=face&fm=webp&q=80`}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="56px"
                                unoptimized
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                                {(writer.name || writer.email).charAt(0).toUpperCase()}
                            </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {photoBusy ? '...' : 'Change'}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={photoBusy}
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                event.target.value = '';
                                if (file) choosePhoto(file);
                            }}
                        />
                    </label>

                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{writer.name || writer.email}</p>
                        <p className="truncate text-sm text-gray-500">{writer.email}</p>
                    </div>

                    <button
                        type="button"
                        onClick={signOut}
                        className="ml-auto shrink-0 cursor-pointer text-sm font-medium text-gray-500 underline hover:text-black"
                    >
                        Not you?
                    </button>
                </div>

                {!photoUrl && !photoError && (
                    <p className="mt-3 text-sm text-gray-500">
                        Tap the circle to add the photo that appears next to your articles.
                    </p>
                )}
                {photoError && <p className="mt-3 text-sm text-red-600">{photoError}</p>}
            </div>

            <div>
                <span className={labelClass}>
                    Cover photo <span className="text-red-500">*</span>
                </span>
                {cover ? (
                    <div className="flex items-center gap-4">
                        <span className="relative block w-40 h-28 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                                src={`${cover.url}?w=320&h=224&fit=fill&fm=webp&q=80`}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="160px"
                                unoptimized
                            />
                        </span>
                        <button
                            type="button"
                            onClick={() => setCover(null)}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 underline hover:text-black cursor-pointer"
                        >
                            <X className="w-4 h-4" /> Remove
                        </button>
                    </div>
                ) : (
                    <label className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-5 py-3 cursor-pointer hover:border-black text-gray-600 hover:text-black">
                        <Plus className="w-4 h-4" /> Add a cover photo
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                                uploadCover(event.target.files?.[0]);
                                event.target.value = '';
                            }}
                        />
                    </label>
                )}
            </div>

            <div>
                <span className={labelClass}>
                    Your article <span className="text-red-500">*</span>
                </span>
                <p className="text-sm text-gray-500 mb-2">
                    Write it here. Use the buttons for headings, bold, lists and photos.
                </p>
                <MarkdownEditor
                    value={body}
                    onChange={setBody}
                    rows={16}
                    assetUrls={assetUrls}
                    onAssetUploaded={(id, url) => setAssetUrls((current) => ({ ...current, [id]: url }))}
                    onError={setError}
                    uploadPath="/api/contribute/upload"
                />
            </div>

            <div>
                <span className={labelClass}>Topics</span>
                <p className="text-sm text-gray-500 mb-1">
                    A few words describing what your article is about &mdash; like{' '}
                    <span className="font-medium text-gray-700">study tips</span>,{' '}
                    <span className="font-medium text-gray-700">internships</span> or{' '}
                    <span className="font-medium text-gray-700">first year</span>. They help readers
                    find articles on the same subject.
                </p>
                <p className="text-sm text-gray-500 mb-2">
                    Type one and press Enter, then add another. Two or three is plenty, and you can
                    leave this empty if you are not sure.
                </p>
                <div className="rounded-lg border border-gray-300 bg-white p-3 flex flex-col gap-3">
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full pl-3 pr-2 py-1 text-sm">
                                    {tag}
                                    <button
                                        type="button"
                                        aria-label={`Remove ${tag}`}
                                        onClick={() => setTags(tags.filter((item) => item !== tag))}
                                        className="p-0.5 rounded-full hover:bg-gray-300 cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <input
                        value={tagDraft}
                        onChange={(event) => setTagDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ',') {
                                event.preventDefault();
                                addTag();
                            }
                        }}
                        placeholder="e.g. study tips"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-black"
                    />
                </div>
            </div>

            <input
                type="text"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
            />

            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-sm">
                    {busy && <p className="text-gray-600">{busy}</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    {!busy && !error && (
                        <p className="text-gray-500">
                            Nothing is published straight away. The GESA team reviews every article first.
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={!canSend || sending || Boolean(busy)}
                    className="bg-primary text-black font-semibold rounded-lg px-6 py-3 disabled:opacity-40 hover:scale-[1.02] transition-transform cursor-pointer flex items-center justify-center gap-2 min-w-44"
                >
                    {sending ? <StarSpinner /> : <><Send className="w-4 h-4" /> Send for review</>}
                </button>
            </div>
        </form>
    );
};

export default ContributeForm;
