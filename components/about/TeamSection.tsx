'use client';

import Container from '../custom/Container';
import TeamCard from './TeamCard';
import { teamMembers } from '@/lib/data/team';

const TeamSection = () => {
    return (
        <section className="py-24 bg-white font-poppins relative">
            <Container size="xl">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">The Creators</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-header text-slate-900">
                        Meet the <span className="text-primary">Development Team</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        The talented engineering students who dedicated their time, skills, and creativity to build this platform for the entire GESA community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 lg:gap-x-12 lg:gap-y-24">
                    {teamMembers.map((member, index) => (
                        <TeamCard key={index} member={member} index={index} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default TeamSection;
