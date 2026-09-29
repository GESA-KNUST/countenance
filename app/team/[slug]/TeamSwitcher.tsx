'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, User, X } from 'lucide-react';
import type { TeamMember } from '@/lib/data/team';

interface TeamSwitcherProps {
    members: TeamMember[];
    currentSlug: string;
}

const TeamSwitcher = ({ members, currentSlug }: TeamSwitcherProps) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);
        closeRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, close]);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap font-medium group text-slate-900 cursor-pointer"
            >
                View all members
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                        onClick={close}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Choose a team member"
                            initial={{ opacity: 0, y: 24, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                            onClick={(event) => event.stopPropagation()}
                            className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl"
                        >
                            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 pb-5 pt-6 sm:px-8">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="h-px w-8 bg-[#FFBE00]" />
                                        <p className="font-header text-xs font-bold uppercase tracking-[0.2em] text-[#B88900]">
                                            The team
                                        </p>
                                    </div>
                                    <h2 className="mt-2 font-header text-2xl font-bold text-slate-900">
                                        Meet someone else
                                    </h2>
                                </div>
                                <button
                                    ref={closeRef}
                                    type="button"
                                    onClick={close}
                                    aria-label="Close"
                                    className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 sm:p-8">
                                {members.map((person) => {
                                    const isCurrent = person.slug === currentSlug;

                                    const card = (
                                        <>
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                                {person.image ? (
                                                    <Image
                                                        src={person.image}
                                                        alt={person.name}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                        <User size={24} strokeWidth={1.5} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-header font-bold text-slate-900">
                                                    {person.name}
                                                </p>
                                                <p className="truncate text-sm text-slate-500">
                                                    {person.role}
                                                </p>
                                                {isCurrent && (
                                                    <span className="mt-1 inline-block rounded-full bg-[#FFBE00] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">
                                                        You are here
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    );

                                    if (isCurrent) {
                                        return (
                                            <div
                                                key={person.slug}
                                                aria-current="page"
                                                className="flex items-center gap-4 rounded-2xl border border-[#FFBE00] bg-amber-50/60 p-4"
                                            >
                                                {card}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={person.slug}
                                            href={`/team/${person.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFBE00]"
                                        >
                                            {card}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="border-t border-slate-100 px-6 py-4 text-center sm:px-8">
                                <Link
                                    href="/team"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                                >
                                    Open the full team page
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TeamSwitcher;
