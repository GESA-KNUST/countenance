'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarOff, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
    title: string;
    message: string;
    showHomeButton?: boolean;
    onRefresh?: () => void;
    isHero?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    showHomeButton = true,
    onRefresh,
    isHero = false,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`flex flex-col items-center justify-center text-center p-8 ${isHero ? 'min-h-[400px]' : 'py-20 w-full'
                }`}
        >
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="mb-6 relative"
            >
                <div className="absolute inset-0 bg-[#FFBE00]/20 blur-2xl rounded-full" />
                <CalendarOff className={`relative ${isHero ? 'w-24 h-24' : 'w-16 h-16'} text-[#FFBE00]`} />
            </motion.div>

            <h3 className={`font-header font-bold mb-3 ${isHero ? 'text-4xl md:text-5xl text-white' : 'text-2xl md:text-3xl text-gray-900'}`}>
                {title}
            </h3>

            <p className={`max-w-md mb-8 ${isHero ? 'text-lg md:text-xl text-white/70' : 'text-base md:text-lg text-gray-600'}`}>
                {message}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-6 py-3 bg-[#FFBE00] text-black font-semibold rounded-full hover:bg-[#e5ab00] transition-colors shadow-lg shadow-[#FFBE00]/20"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                )}

                {showHomeButton && (
                    <Link
                        href="/"
                        className={`flex items-center gap-2 px-6 py-3 border font-semibold rounded-full transition-colors ${isHero
                                ? 'border-white/20 text-white hover:bg-white/10'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                            }`}
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

export default EmptyState;
