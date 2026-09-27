'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MAX_ORIGINAL_BYTES, resizeForHero } from '@/lib/admin/resize';

interface ImagePickerProps {
    value: string[];
    urls: Record<string, string>;
    multiple: boolean;
    onChange: (ids: string[], urls: Record<string, string>) => void;
    onBusy: (busy: string) => void;
    onError: (message: string) => void;
}

const MAX_IMAGES = 12;

const ImagePicker = ({
    value,
    urls,
    multiple,
    onChange,
    onBusy,
    onError,
}: ImagePickerProps) => {
    const [localUrls, setLocalUrls] = useState(urls);

    const urlFor = (id: string) => localUrls[id] ?? urls[id];

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= value.length) return;
        const next = [...value];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next, localUrls);
    };

    const remove = (index: number) => {
        onChange(value.filter((_, i) => i !== index), localUrls);
    };

    const addFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        onError('');

        const room = multiple ? MAX_IMAGES - value.length : 1;
        if (room <= 0) {
            onError(`You can have at most ${MAX_IMAGES} photos here. Remove one first.`);
            return;
        }

        const chosen = Array.from(files).slice(0, room);
        const addedIds: string[] = [];
        const addedUrls: Record<string, string> = {};

        for (const [index, file] of chosen.entries()) {
            onBusy(`Adding photo ${index + 1} of ${chosen.length}...`);

            if (!file.type.startsWith('image/')) {
                onError(`"${file.name}" is not a photo.`);
                onBusy('');
                return;
            }
            if (file.size > MAX_ORIGINAL_BYTES) {
                onError(`"${file.name}" is too big. Please pick a smaller photo.`);
                onBusy('');
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
                addedIds.push(asset.id);
                addedUrls[asset.id] = asset.url;
            } catch (uploadError) {
                onError(
                    uploadError instanceof Error ? uploadError.message : 'That photo could not be added.'
                );
                onBusy('');
                if (addedIds.length > 0) {
                    const merged = { ...localUrls, ...addedUrls };
                    setLocalUrls(merged);
                    onChange(multiple ? [...value, ...addedIds] : addedIds.slice(0, 1), merged);
                }
                return;
            }
        }

        onBusy('');
        const merged = { ...localUrls, ...addedUrls };
        setLocalUrls(merged);
        onChange(multiple ? [...value, ...addedIds] : addedIds.slice(0, 1), merged);
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {value.map((id, index) => (
                <div key={`${id}-${index}`} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                    <div className="relative aspect-4/3 bg-gray-100">
                        {urlFor(id) ? (
                            <Image
                                src={`${urlFor(id)}?w=480&h=360&fit=fill&fm=jpg&q=70`}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 240px"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full grid place-items-center text-xs text-gray-400">
                                Photo
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label="Remove this photo"
                            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {multiple && value.length > 1 && (
                        <div className="flex items-center justify-between px-2 py-2">
                            <button
                                type="button"
                                onClick={() => move(index, -1)}
                                disabled={index === 0}
                                aria-label="Move earlier"
                                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-25 cursor-pointer"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-gray-500">{index + 1}</span>
                            <button
                                type="button"
                                onClick={() => move(index, 1)}
                                disabled={index === value.length - 1}
                                aria-label="Move later"
                                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-25 cursor-pointer"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {(multiple || value.length === 0) && (
                <label className="rounded-xl border-2 border-dashed border-gray-300 hover:border-black transition-colors flex flex-col items-center justify-center gap-2 aspect-4/3 cursor-pointer text-gray-500 hover:text-black">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm font-medium">
                        {multiple ? 'Add photos' : 'Add photo'}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple={multiple}
                        className="hidden"
                        onChange={(event) => {
                            addFiles(event.target.files);
                            event.target.value = '';
                        }}
                    />
                </label>
            )}
        </div>
    );
};

export default ImagePicker;
