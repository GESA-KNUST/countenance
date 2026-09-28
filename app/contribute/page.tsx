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
        <div className="font-poppins bg-white">
            <div className={writer ? 'border-b border-gray-100' : ''}>
                <Container size="lg">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-balance font-header text-4xl font-bold leading-[1.05] tracking-tight text-[#252638] sm:text-5xl lg:text-[3.5rem]">
                            Your story belongs on the blog.
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
                            The internship that changed your year. The project that nearly broke you.
                            The thing you wish somebody had told you in first year.
                        </p>

                        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
                            Your article stays yours, it goes out under your own name, and you can
                            ask us to take it down whenever you like.
                        </p>

                        {!writer && (
                            <div className="mt-10">
                                <SignInPanel configured={isSignInConfigured()} error={error} />
                            </div>
                        )}
                    </div>
                </Container>
            </div>

            {writer && (
                <Container size="lg">
                    <ContributeForm writer={writer} savedPhotoUrl={profile?.photoUrl ?? null} />
                </Container>
            )}
        </div>
    );
};

export default ContributePage;
