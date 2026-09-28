import type { Metadata } from 'next';
import Container from '@/components/custom/Container';
import ContributeForm from './ContributeForm';
import SignInPanel from './SignInPanel';
import { currentWriter, isSignInConfigured } from '@/lib/contribute/session';
import { profileForEmail } from '@/lib/admin/author-identity';

export const metadata: Metadata = {
    title: 'Write for the GESA blog',
    description:
        'Share your knowledge, experience and insights with the GESA-KNUST engineering community. Write your article and send it to the team for review.',
    openGraph: {
        title: 'Write for the GESA blog',
        description: 'Share your knowledge and experience with the GESA-KNUST engineering community.',
    },
};

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ContributePage = async ({ searchParams }: Props) => {
    const writer = await currentWriter();
    const params = await searchParams;
    const profile = writer ? await profileForEmail(writer.email).catch(() => null) : null;
    const error = typeof params.error === 'string' ? params.error : '';

    return (
        <div className="font-poppins min-h-screen bg-white">
            <div className="relative overflow-hidden border-b border-gray-100">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-56 -right-40 h-[26rem] w-[26rem] rounded-full bg-[#FFBE00]/20 blur-[100px]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-[#252638]/[0.04] blur-[90px]"
                />

                <Container size="lg" className="relative">
                    <h1 className="max-w-3xl font-header text-4xl font-bold leading-[1.05] tracking-tight text-[#252638] sm:text-5xl md:text-6xl">
                        Your story belongs on the blog.
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                        The internship that changed your year. The project that nearly broke you.
                        The thing you wish somebody had told you in first year. Your article stays
                        yours &mdash; it goes out under your own name, and you can ask us to take it
                        down whenever you like.
                    </p>
                </Container>
            </div>

            <Container size="lg">
                {writer ? (
                    <ContributeForm writer={writer} savedPhotoUrl={profile?.photoUrl ?? null} />
                ) : (
                    <SignInPanel configured={isSignInConfigured()} error={error} />
                )}
            </Container>
        </div>
    );
};

export default ContributePage;
