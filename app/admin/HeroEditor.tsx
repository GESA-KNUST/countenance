'use client';
import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle, Check, ChevronLeft, ChevronRight, Plus, Save, X } from 'lucide-react';
import StarSpinner from '@/components/ui/StarSpinner';
import { MAX_ORIGINAL_BYTES, resizeForHero } from '@/lib/admin/resize';
import type { HeroImage } from '@/lib/admin/contentful-write';

const MAX_IMAGES = 10;

interface HeroEditorProps {
    pageKey: string;
    livePath: string;
    initialImages: HeroImage[];
    initialMobileImages: HeroImage[];
}

type Strip = 'desktop' | 'phone';

const HeroEditor = ({
    pageKey,
    livePath,
    initialImages,
    initialMobileImages,
}: HeroEditorProps) => {
    const [images, setImages] = useState(initialImages);
    const [mobileImages, setMobileImages] = useState(initialMobileImages);
    const [uploading, setUploading] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    const setStrip = (strip: Strip, next: HeroImage[]) => {
        setSaved(false);
        if (strip === 'desktop') setImages(next);
        else setMobileImages(next);
    };

    const move = (strip: Strip, index: number, direction: -1 | 1) => {
        const list = strip === 'desktop' ? images : mobileImages;
        const target = index + direction;
        if (target < 0 || target >= list.length) return;
        const next = [...list];
        [next[index], next[target]] = [next[target], next[index]];
        setStrip(strip, next);
    };

    const remove = (strip: Strip, index: number) => {
        const list = strip === 'desktop' ? images : mobileImages;
        setStrip(strip, list.filter((_, i) => i !== index));
    };

    const addFiles = async (strip: Strip, files: FileList | null) => {
        if (!files || files.length === 0) return;
        setError('');
        setSaved(false);

        const list = strip === 'desktop' ? images : mobileImages;
        const room = MAX_IMAGES - list.length;
        if (room <= 0) {
            setError(`You can have at most ${MAX_IMAGES} photos here. Remove one first.`);
            return;
        }

        const chosen = Array.from(files).slice(0, room);
        const added: HeroImage[] = [];

        for (const [index, file] of chosen.entries()) {
            setUploading(`Adding photo ${index + 1} of ${chosen.length}...`);

            if (!file.type.startsWith('image/')) {
                setError(`"${file.name}" is not a photo.`);
                setUploading('');
                return;
            }
            if (file.size > MAX_ORIGINAL_BYTES) {
                setError(`"${file.name}" is too big. Please pick a smaller photo.`);
                setUploading('');
                return;
            }

            try {
                const resized = await resizeForHero(file);
                const body = new FormData();
                body.append('file', resized);

                const res = await fetch('/api/admin/upload', { method: 'POST', body });
                if (!res.ok) {
                    const payload = await res.json().catch(() => ({}));
                    throw new Error(payload.message ?? 'That photo could not be added.');
                }
                const asset = await res.json();
                added.push({ id: asset.id, url: asset.url });
            } catch (uploadError) {
                setError(
                    uploadError instanceof Error
                        ? uploadError.message
                        : 'That photo could not be added.'
                );
                setUploading('');
                if (added.length > 0) setStrip(strip, [...list, ...added]);
                return;
            }
        }

        setUploading('');
        setStrip(strip, [...list, ...added]);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/admin/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageKey,
                    imageIds: images.map((image) => image.id),
                    mobileImageIds: mobileImages.map((image) => image.id),
                }),
            });

            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                setError(payload.message ?? 'Those photos could not be saved.');
                setSaving(false);
                return;
            }

            setSaved(true);
        } catch {
            setError('No internet connection. Your photos were not saved.');
        }

        setSaving(false);
    };

    const renderStrip = (strip: Strip, list: HeroImage[]) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {list.map((image, index) => (
                <div
                    key={image.id}
                    className="relative rounded-xl overflow-hidden border border-gray-200 bg-white"
                >
                    <div className="relative aspect-4/3 bg-gray-100">
                        <Image
                            src={`${image.url}?w=480&h=360&fit=fill&fm=jpg&q=70`}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 240px"
                            unoptimized
                        />

                        {strip === 'desktop' && index === 0 && (
                            <span className="absolute top-2 left-2 bg-primary text-black text-[11px] font-semibold px-2 py-1 rounded-full">
                                Share photo
                            </span>
                        )}

                        <button
                            onClick={() => remove(strip, index)}
                            aria-label="Remove this photo"
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-2 py-2">
                        <button
                            onClick={() => move(strip, index, -1)}
                            disabled={index === 0}
                            aria-label="Move earlier"
                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-25 cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-xs text-gray-500">{index + 1}</span>
                        <button
                            onClick={() => move(strip, index, 1)}
                            disabled={index === list.length - 1}
                            aria-label="Move later"
                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-25 cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}

            <label className="rounded-xl border-2 border-dashed border-gray-300 hover:border-black transition-colors flex flex-col items-center justify-center gap-2 aspect-4/3 cursor-pointer text-gray-500 hover:text-black">
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">Add photos</span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                        addFiles(strip, event.target.files);
                        event.target.value = '';
                    }}
                />
            </label>
        </div>
    );

    return (
        <div className="flex flex-col gap-10">
            <section>
                <h2 className="font-semibold mb-1">Photos</h2>
                <p className="text-sm text-gray-500 mb-4">
                    These slide across the top of the page, in this order. The first one is also
                    used when someone shares the page on WhatsApp or Facebook.
                </p>
                {renderStrip('desktop', images)}
            </section>

            <section>
                <h2 className="font-semibold mb-1">Phone photos (optional)</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Taller versions shown on phones. Leave this empty to use the photos above.
                </p>
                {renderStrip('phone', mobileImages)}
            </section>

            <div className="sticky bottom-0 -mx-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-sm">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 text-sm min-w-0">
                        {uploading && (
                            <p className="flex items-center gap-2 text-gray-600">
                                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                                {uploading}
                            </p>
                        )}
                        {error && (
                            <p className="flex items-start gap-2 text-red-600">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </p>
                        )}
                        {saved && !error && (
                            <p className="flex flex-wrap items-center gap-2 font-medium text-green-700">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                    <Check className="w-3.5 h-3.5" />
                                </span>
                                Saved.
                                <a href={livePath} target="_blank" rel="noreferrer" className="underline font-normal">
                                    View the live page
                                </a>
                            </p>
                        )}
                        {!uploading && !error && !saved && (
                            <p className="text-gray-500">
                                {images.length} photo{images.length === 1 ? '' : 's'} on this page.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving || Boolean(uploading) || images.length === 0}
                        className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFBE00] px-6 py-3 text-sm font-bold text-black shadow-sm transition-all hover:bg-[#EDAF00] active:scale-[0.99] disabled:cursor-default disabled:opacity-45 disabled:hover:bg-[#FFBE00] cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <StarSpinner />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroEditor;
