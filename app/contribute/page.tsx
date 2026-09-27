import type { Metadata } from 'next';
import Container from '@/components/custom/Container';
import ContributeForm from './ContributeForm';

export const metadata: Metadata = {
    title: 'Write for the GESA blog',
    description:
        'Share your knowledge, experience and insights with the GESA-KNUST engineering community. Write your article and send it to the team for review.',
    openGraph: {
        title: 'Write for the GESA blog',
        description: 'Share your knowledge and experience with the GESA-KNUST engineering community.',
    },
};

const ContributePage = () => {
    return (
        <div className="font-poppins min-h-screen bg-white">
            <div className="bg-[#252638] text-white">
                <Container size="lg">
                    <span className="inline-block bg-[#FFBE00] text-black text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                        Contribute
                    </span>
                    <h1 className="font-header font-bold text-3xl sm:text-4xl md:text-5xl mt-4 leading-tight">
                        Write for the GESA blog
                    </h1>
                    <p className="text-white/75 mt-4 max-w-2xl text-lg">
                        Share what you know with engineering students across KNUST. Write your article
                        below, add photos, and send it to the team. Someone will review it before it
                        goes live.
                    </p>
                </Container>
            </div>

            <Container size="lg">
                <ContributeForm />
            </Container>
        </div>
    );
};

export default ContributePage;
