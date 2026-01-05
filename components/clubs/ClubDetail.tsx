'use client';

import Image from 'next/image';
import Link from 'next/link';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { Globe, ArrowLeft, Share2, ExternalLink, Info } from 'lucide-react';
import { ClubItems } from '@/hooks/useClubs';
import Container from '../custom/Container';

interface ClubDetailProps {
    club: ClubItems;
}

const ClubDetail: React.FC<ClubDetailProps> = ({ club }) => {
    const { clubName, description, clubLogo, clubType, clubLink, isActivelyRecruitingMembers, aboutclub } = club;

    const options: Options = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                const assetId = node.data.target.sys.id;
                const asset = aboutclub?.links?.assets?.block?.find((a: any) => a.sys.id === assetId);

                if (!asset) return null;

                return (
                    <div className="my-8 w-full rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={asset.url}
                            alt={asset.title || "Embedded Asset"}
                            width={asset.width || 800}
                            height={asset.height || 600}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                );
            },
        },
    };

    const QuickOverview = () => (
        <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</span>
                <p className="font-bold text-gray-900">{clubType}</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Membership</span>
                <p className="font-bold text-gray-900">Open to all GESA Students</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
                {isActivelyRecruitingMembers ? (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-sm font-medium text-gray-700 italic">
                            Currently accepting new members for the academic year.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <p className="text-sm font-medium text-gray-500 italic">
                            Membership recruitment is currently closed. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-poppins">
            {/* Hero Section */}
            <div className="relative h-[40vh] sm:h-[50vh] w-full overflow-hidden bg-gray-900">
                <Image
                    src={clubLogo.url}
                    alt={clubLogo.title || clubName}
                    fill
                    className="object-cover opacity-60 scale-105 blur-[2px]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Link
                            href="/clubs"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-all hover:-translate-x-1"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Clubs and Societies</span>
                        </Link>

                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl animate-in zoom-in duration-700">
                            <Image
                                src={clubLogo.url}
                                alt={clubName}
                                fill
                                className="object-contain bg-white p-2"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {clubType}
                            </div>
                            <h1 className="font-header text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                                {clubName}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <Container size="xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-16 relative z-30">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

                            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-header flex items-center gap-3">
                                <Globe className="text-primary w-6 h-6" />
                                About the Community
                            </h2>

                            <div className="prose prose-lg text-gray-600 max-w-none">
                                {description.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-6 leading-relaxed text-lg">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Mobile Quick Overview - Visible only on mobile */}
                            <div className="mt-12 border-t border-gray-100 pt-12 lg:hidden">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-header">Quick Overview</h3>
                                <QuickOverview />
                            </div>

                            {aboutclub && aboutclub.json && (
                                <div className="mt-12 border-t border-gray-100 pt-12">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-8 font-header flex items-center gap-3">
                                        <Info className="text-primary w-6 h-6" />
                                        More Information
                                    </h2>
                                    <div className="prose prose-lg text-gray-600 max-w-none">
                                        {documentToReactComponents(aboutclub.json, options)}
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 pt-10 border-t border-gray-100 flex flex-wrap gap-4">
                                <a
                                    href={clubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Join Our Community
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Visible only on desktop */}
                    <div className="hidden lg:block lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-header">Quick Overview</h3>
                            <QuickOverview />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ClubDetail;
