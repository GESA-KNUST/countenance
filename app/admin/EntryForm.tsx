'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, Lock, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { useState as useLocalState } from 'react';
import StarSpinner from '@/components/ui/StarSpinner';
import type { CollectionSpec, FieldSpec } from '@/lib/admin/collections';
import type { EntryDetail, FieldValue, RefOption } from '@/lib/admin/entries';
import ImagePicker from './ImagePicker';
import MarkdownEditor from './MarkdownEditor';
import LocationPicker from './LocationPicker';
import { buildSlug } from '@/lib/admin/slug';

interface EntryFormProps {
    collection: CollectionSpec;
    detail: EntryDetail;
    refOptions: Record<string, RefOption[]>;
}

const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-black bg-white';

function blankValues(collection: CollectionSpec): Record<string, FieldValue> {
    const values: Record<string, FieldValue> = {};
    for (const field of collection.fields) {
        if (
            field.kind === 'images' ||
            field.kind === 'entryRefs' ||
            field.kind === 'stringList' ||
            field.kind === 'tagWords'
        ) {
            values[field.id] = [];
        } else if (field.kind === 'boolean') {
            values[field.id] = false;
        } else if (field.kind === 'location') {
            values[field.id] = null;
        } else {
            values[field.id] = '';
        }
    }
    return values;
}

const EntryForm = ({ collection, detail, refOptions }: EntryFormProps) => {
    const [values, setValues] = useState(detail.values);
    const [urls, setUrls] = useState(detail.assetUrls);
    const [busy, setBusy] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const slugSources = collection.slugFrom ?? (collection.titleField ? [collection.titleField] : []);

    const [slugTouched, setSlugTouched] = useState(() => {
        const existing = typeof detail.values.slug === 'string' ? detail.values.slug : '';
        if (!existing) return false;

        const generated =
            buildSlug(slugSources.map((id) => detail.values[id] as string | undefined)) === existing;
        return !(collection.slugFollowsTitle && generated);
    });
    const autoSlug = buildSlug(slugSources.map((id) => values[id] as string | undefined));
    const effectiveSlug =
        slugTouched && typeof values.slug === 'string' && values.slug ? values.slug : autoSlug;

    const set = (id: string, value: FieldValue) => {
        setSaved(false);
        setValues((current) => {
            const next = { ...current, [id]: value };
            if (!slugTouched && slugSources.includes(id)) {
                next.slug = buildSlug(slugSources.map((source) => next[source] as string | undefined));
            }
            return next;
        });
    };

    const handleDelete = async () => {
        setError('');
        setDeleting(true);

        try {
            const res = await fetch('/api/admin/entry', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: collection.type, id: detail.id }),
            });
            const payload = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(payload.message ?? 'It could not be deleted.');
                setConfirmingDelete(false);
                setDeleting(false);
                return;
            }

            router.push(`/admin/c/${collection.type}`);
            router.refresh();
        } catch {
            setError('No internet connection. Nothing was deleted.');
            setDeleting(false);
        }
    };

    const startFresh = () => {
        setValues(blankValues(collection));
        setSaved(false);
        setError('');
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/admin/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: collection.type,
                    id: detail.id,
                    values,
                    lockedFields: Object.keys(detail.lockedFields),
                }),
            });

            const payload = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(payload.message ?? 'That could not be saved.');
                setSaving(false);
                return;
            }

            setSaved(true);
            setSaving(false);

            if (!detail.id && payload.id) {
                router.replace(`/admin/c/${collection.type}/${payload.id}`);
            }
            router.refresh();
        } catch {
            setError('No internet connection. Nothing was saved.');
            setSaving(false);
        }
    };

    const renderField = (field: FieldSpec) => {
        const value = values[field.id];
        const locked = detail.lockedFields[field.id];

        if (field.kind === 'image' || field.kind === 'images') {
            const ids = field.kind === 'images'
                ? (Array.isArray(value) ? (value as string[]) : [])
                : (typeof value === 'string' && value ? [value] : []);

            return (
                <ImagePicker
                    value={ids}
                    urls={urls}
                    multiple={field.kind === 'images'}
                    onChange={(nextIds, nextUrls) => {
                        setUrls(nextUrls);
                        set(field.id, field.kind === 'images' ? nextIds : nextIds[0] ?? '');
                    }}
                    onBusy={setBusy}
                    onError={setError}
                />
            );
        }

        if (field.id === 'slug') {

            if (collection.slugFollowsTitle && !slugTouched) {
                return (
                    <p className="text-sm text-gray-500">
                        {effectiveSlug ? (
                            <>
                                This is made from the name above, so it always matches. The page will
                                be at{' '}
                                <span className="font-medium text-gray-700 break-all">
                                    {collection.slugUrl ?? ''}
                                    {effectiveSlug}
                                </span>
                            </>
                        ) : (
                            <>Fill in the name above and the address appears here.</>
                        )}
                    </p>
                );
            }

            return (
                <>
                    <input
                        type="text"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) => {
                            setSlugTouched(event.target.value !== '');
                            set(field.id, event.target.value);
                        }}
                        placeholder={autoSlug}
                        className={inputClass}
                    />
                    <p className="mt-1.5 text-sm text-gray-500">
                        {effectiveSlug ? (
                            <>
                                Address:{' '}
                                <span className="font-medium text-gray-700 break-all">
                                    {collection.slugUrl ?? ''}
                                    {effectiveSlug}
                                </span>
                            </>
                        ) : (
                            <>Fill in the title above and the address appears here.</>
                        )}
                    </p>
                </>
            );
        }

        if (field.kind === 'richtext') {
            if (locked) {
                return (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
                        <p className="flex items-center gap-2 font-medium text-amber-900">
                            <Lock className="w-4 h-4" /> This one has to be edited in Contentful
                        </p>
                        <p className="text-amber-800 mt-1">
                            It contains {locked}, which this simple editor cannot show without
                            breaking it. Everything else on this page still saves normally.
                        </p>
                    </div>
                );
            }

            return (
                <MarkdownEditor
                    value={typeof value === 'string' ? value : ''}
                    onChange={(next) => set(field.id, next)}
                    rows={field.id === 'blogContent' ? 18 : 8}
                    assetUrls={urls}
                    onAssetUploaded={(id, url) => setUrls((current) => ({ ...current, [id]: url }))}
                    onError={setError}
                    allowImages={field.allowImages !== false}
                />
            );
        }

        if (field.kind === 'longtext') {
            return (
                <textarea
                    value={typeof value === 'string' ? value : ''}
                    onChange={(event) => set(field.id, event.target.value)}
                    rows={5}
                    className={inputClass}
                />
            );
        }

        if (field.kind === 'boolean') {
            return (
                <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => set(field.id, event.target.checked)}
                        className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">Yes</span>
                </label>
            );
        }

        if (field.kind === 'stringList') {
            const list = Array.isArray(value) ? (value as string[]) : [];
            return (
                <textarea
                    value={list.join('\n')}
                    onChange={(event) =>
                        set(
                            field.id,
                            event.target.value.split('\n').map((line) => line.trim()).filter(Boolean)
                        )
                    }
                    rows={4}
                    className={inputClass}
                />
            );
        }

        if (field.kind === 'location') {
            const point = (value ?? null) as { lat: number; lon: number } | null;
            return <LocationPicker value={point} onChange={(next) => set(field.id, next)} />;
        }

        if (field.kind === 'entryRef' || field.kind === 'entryRefs') {
            const options = refOptions[field.refType ?? ''] ?? [];

            if (field.kind === 'entryRef') {
                return (
                    <select
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) => set(field.id, event.target.value)}
                        className={`${inputClass} cursor-pointer`}
                    >
                        <option value="">Not chosen</option>
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            }

            const selected = Array.isArray(value) ? (value as string[]) : [];
            return (
                <div className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-3 max-h-56 overflow-y-auto">
                    {options.length === 0 && (
                        <p className="text-sm text-gray-500">Nothing to choose from yet.</p>
                    )}
                    {options.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                checked={selected.includes(option.id)}
                                onChange={(event) =>
                                    set(
                                        field.id,
                                        event.target.checked
                                            ? [...selected, option.id]
                                            : selected.filter((id) => id !== option.id)
                                    )
                                }
                                className="w-4 h-4 cursor-pointer"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            );
        }

        if (field.kind === 'tagWords') {
            return (
                <TagInput
                    words={Array.isArray(value) ? (value as string[]) : []}
                    onChange={(words) => set(field.id, words)}
                />
            );
        }

        if (field.kind === 'select') {
            const options = field.options ?? [];
            return (
                <select
                    value={typeof value === 'string' ? value : ''}
                    onChange={(event) => set(field.id, event.target.value)}
                    className={`${inputClass} cursor-pointer`}
                >
                    <option value="">Not chosen</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (field.kind === 'number') {
            return (
                <input
                    type="number"
                    inputMode="decimal"
                    value={typeof value === 'string' ? value : ''}
                    onChange={(event) => set(field.id, event.target.value)}
                    className={inputClass}
                />
            );
        }

        const inputType =
            field.kind === 'date'
                ? 'date'
                : field.kind === 'datetime'
                    ? 'datetime-local'
                    : field.kind === 'email'
                        ? 'email'
                        : field.kind === 'phone'
                            ? 'tel'
                            : field.kind === 'url'
                                ? 'url'
                                : 'text';

        return (
            <input
                type={inputType}
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => set(field.id, event.target.value)}
                className={inputClass}
            />
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {collection.fields.map((field) => (
                <div key={field.id}>
                    <label className="block font-medium mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.hint && <p className="text-sm text-gray-500 mb-2">{field.hint}</p>}
                    {renderField(field)}
                </div>
            ))}

            <div className="sticky bottom-0 -mx-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-sm">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 text-sm min-w-0">
                        {busy && (
                            <p className="flex items-center gap-2 text-gray-600">
                                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                                {busy}
                            </p>
                        )}
                        {error && (
                            <p className="flex items-start gap-2 text-red-600">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </p>
                        )}
                        {saved && !error && (
                            <p className="flex items-center gap-2 font-medium text-green-700">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                                    <Check className="w-3.5 h-3.5" />
                                </span>
                                Saved and live on the website
                            </p>
                        )}
                        {!busy && !error && !saved && (
                            <p className="text-gray-500">
                                {detail.id ? 'Change anything, then save.' : 'Fill this in, then save.'}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {collection.singleton && detail.id && (
                            <button
                                type="button"
                                onClick={startFresh}
                                disabled={saving || Boolean(busy)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-black disabled:opacity-40 cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Start a new {collection.singular}
                            </button>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={saving || Boolean(busy)}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#FFBE00] px-6 py-3 text-sm font-bold text-black shadow-sm transition-all hover:bg-[#EDAF00] active:scale-[0.99] disabled:cursor-default disabled:opacity-45 disabled:hover:bg-[#FFBE00] cursor-pointer"
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

            {detail.id && (
                <div className="mt-10 border-t border-gray-200 pt-6">
                    {confirmingDelete ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                            <p className="font-semibold text-red-900">
                                Delete this {collection.singular}?
                            </p>
                            <p className="mt-1 text-sm text-red-800">
                                {collection.singleton
                                    ? 'It disappears from the website and cannot be brought back. You can add a new one afterwards.'
                                    : 'It disappears from the website and cannot be brought back. If you only want it off the website for now, close this and use Hide instead.'}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {deleting ? 'Deleting...' : `Yes, delete it`}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmingDelete(false)}
                                    disabled={deleting}
                                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-black disabled:opacity-50"
                                >
                                    Keep it
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmingDelete(true)}
                            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete this {collection.singular}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const TagInput = ({
    words,
    onChange,
}: {
    words: string[];
    onChange: (words: string[]) => void;
}) => {
    const [draft, setDraft] = useLocalState('');

    const commit = () => {
        const value = draft.trim();
        if (!value) return;
        if (!words.includes(value)) onChange([...words, value]);
        setDraft('');
    };

    return (
        <div className="rounded-lg border border-gray-300 bg-white p-3 flex flex-col gap-3">
            {words.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {words.map((word) => (
                        <span
                            key={word}
                            className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full pl-3 pr-2 py-1 text-sm"
                        >
                            {word}
                            <button
                                type="button"
                                aria-label={`Remove ${word}`}
                                onClick={() => onChange(words.filter((item) => item !== word))}
                                className="p-0.5 rounded-full hover:bg-gray-300 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    type="text"
                    value={draft}
                    placeholder="Type a tag, press Enter"
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault();
                            commit();
                        }
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-black"
                />
                <button
                    type="button"
                    onClick={commit}
                    disabled={draft.trim() === ''}
                    className="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:border-black cursor-pointer disabled:opacity-40"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default EntryForm;
