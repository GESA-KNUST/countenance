import React from 'react';
import Container from '../custom/Container';

const historyData = {
    history: [
        "GESA was founded in 1967 as the official representative body for all engineering students at KNUST.",
        "It emerged after the School of Engineering was established in 1952 and KNUST attained full university status in 1961.",
        "Originally representing students in Civil, Electrical and Mechanical Engineering, GESA grew as more departments were created.",
        "In 2003, the School of Engineering became the College of Engineering, expanding its academic programs.",
        "GESA’s longstanding mandate has been to protect student interests, foster academic excellence, and create platforms for leadership and innovation."
    ],
    events: [
        "Mindset Revolution Workshop – A transformative mindset and personal development training led by Akosua Bame.",
        "Engineering Week Celebrations – Departmental exhibitions, seminars, innovation challenges, and alumni networking events.",
        "Tech & Innovation Seminars – Training programs focused on AI, renewable energy, automation, and modern engineering tools.",
        "Leadership Development Programs – Capacity-building sessions for student leaders within the College of Engineering.",
        "Community Impact Projects – Outreach programs aimed at promoting STEM education in basic and secondary schools."
    ],
    facts: [
        "GESA is one of the oldest student associations at KNUST.",
        "The College of Engineering is the largest college in KNUST by student population.",
        "Many prominent Ghanaian engineers, CEOs, and leaders were once GESA members.",
        "The popular Engineering Week (ENG Week) has been running for decades and remains one of the most vibrant celebrations on campus.",
        "Alumni of GESA hold influential positions in energy, telecommunications, aviation, academia, and government sectors."
    ]
};

const HistorySection = () => {
    return (
        <div className="bg-slate-50 font-header">
            <Container size="xl">
                <div className="flex flex-col gap-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">About GESA</h2>
                        <p className="text-medium-dark max-w-3xl mx-auto text-lg">
                            The Ghana Engineering Students' Association (GESA) has a rich history of excellence, innovation, and leadership.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* History */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4 border-slate-100 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">H</span>
                                Our History
                            </h3>
                            <ul className="space-y-4">
                                {historyData.history.map((item, i) => (
                                    <li key={i} className="text-[15px] text-gray-600 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-primary/40 before:rounded-full">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Events */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4 border-slate-100 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
                                Recent Activities
                            </h3>
                            <ul className="space-y-4">
                                {historyData.events.map((item, i) => (
                                    <li key={i} className="text-[15px] text-gray-600 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-primary/40 before:rounded-full">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Facts */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4 border-slate-100 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">F</span>
                                Fun Facts
                            </h3>
                            <ul className="space-y-4">
                                {historyData.facts.map((item, i) => (
                                    <li key={i} className="text-[15px] text-gray-600 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-primary/40 before:rounded-full">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default HistorySection;
