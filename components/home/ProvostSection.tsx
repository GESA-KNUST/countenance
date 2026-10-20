'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Container from '../custom/Container';

const rise = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
};

const ProvostSection = () => {
    return (
        <section className="py-14 md:py-24 bg-white">
            <Container size="xl" className="!py-0">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                    className="flex flex-col gap-10 md:gap-14"
                >
                    <div className="w-full flex flex-col gap-5">
                        <motion.div variants={rise} className="text-center">
                            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                                GESA Patron
                            </span>
                        </motion.div>

                        <motion.h2
                            variants={rise}
                            className="text-center font-header font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl"
                        >
                            Prof. Kwabena Biritwum Nyarko
                        </motion.h2>

                        <motion.p
                            variants={rise}
                            className="text-center text-base sm:text-lg md:text-xl text-gray-500"
                        >
                            Provost, College of Engineering &mdash; KNUST
                        </motion.p>

                        <motion.div
                            variants={rise}
                            className="text-base sm:text-lg leading-relaxed text-gray-700 mt-2 lg:columns-2 lg:gap-14"
                        >
                            <p className="mb-4 break-inside-avoid">
                                {`Professor Kwabena Biritwum Nyarko is a Professor at the Civil Engineering Department of Kwame Nkrumah University of Science and Technology, Kumasi, Ghana. He has 30 years of teaching and research experience in Water and Sanitation. His research focuses on water transport and distribution, sanitation technologies, and sustainable water and sanitation service delivery.`}
                            </p>
                            <p className="mb-4 break-inside-avoid">
                                {`He is the Provost of the College of Engineering at KNUST and a valued member of the Regional Water and Sanitation Centre, Kumasi (RWESCK). He serves on the Board of the Engineering Council of Ghana and is a Council member of the Ghana Institution of Engineers.`}
                            </p>
                            <p className="text-sm sm:text-base text-gray-500 break-inside-avoid">
                                {`Prof Nyarko has over one hundred (100) publications in peer-reviewed journals, conference proceedings, and technical reports.`}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={rise}
                        className="relative w-full aspect-4/3 sm:aspect-3/2 rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-white"
                    >
                        <Image
                            src="/images/Provost.webp"
                            alt="Professor Kwabena Biritwum Nyarko, Provost of the College of Engineering, KNUST"
                            fill
                            className="object-cover object-[50%_35%]"
                            sizes="(max-width: 1024px) 100vw, 1152px"
                        />
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
};

export default ProvostSection;
