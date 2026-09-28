'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, PenLine } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const DISMISSED_KEY = 'gesa-contribute-nudge';
const QUIET_FOR_DAYS = 60;

const SCROLL_TRIGGER = 0.45;
const EARLIEST_MS = 8000;

function recentlyDismissed() {
    try {
        const until = Number(window.localStorage.getItem(DISMISSED_KEY));
        return Number.isFinite(until) && until > Date.now();
    } catch {
        return false;
    }
}

function rememberDismissal() {
    try {
        window.localStorage.setItem(
            DISMISSED_KEY,
            String(Date.now() + QUIET_FOR_DAYS * 24 * 60 * 60 * 1000)
        );
    } catch {
    }
}

const ContributeNudge = () => {
    const [show, setShow] = useState(false);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        if (recentlyDismissed()) return;

        const readyAt = Date.now() + EARLIEST_MS;

        const check = () => {
            if (Date.now() < readyAt) return;

            const scrollable = document.body.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;

            if (window.scrollY / scrollable >= SCROLL_TRIGGER) {
                setShow(true);
                window.removeEventListener('scroll', check);
            }
        };

        window.addEventListener('scroll', check, { passive: true });
        return () => window.removeEventListener('scroll', check);
    }, []);

    const close = () => {
        setShow(false);
        rememberDismissal();
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.aside
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[21rem]"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-xl backdrop-blur-sm">
                        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[#FFBE00]" />

                        <button
                            type="button"
                            onClick={close}
                            aria-label="Close"
                            className="absolute right-3 top-3 cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <p className="pr-8 font-header text-lg font-bold text-[#252638]">
                            Enjoying this?
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                            Students write everything here. Yours could be the next one somebody
                            reads all the way down.
                        </p>

                        <Link
                            href="/contribute"
                            onClick={close}
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#252638] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <PenLine className="h-4 w-4" />
                            Write for the blog
                        </Link>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default ContributeNudge;
