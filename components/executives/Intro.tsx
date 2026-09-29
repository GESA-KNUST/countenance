import { Star } from 'lucide-react';

const Intro = () => {
  return (
    <div className="bg-white px-6 py-14 sm:px-12 sm:py-16 md:px-16 md:py-20 lg:px-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 sm:gap-12">
        <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-[#FFBE00]" fill="#FFBE00" />
            <h6 className="text-[#FFBE00] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] font-header">
              Meet our executives
            </h6>
            <Star className="w-3.5 h-3.5 text-[#FFBE00]" fill="#FFBE00" />
          </div>

          <h2 className="text-[1.6rem] leading-[1.25] sm:text-3xl md:text-4xl font-bold text-[#252638] font-header">
            Behind every success is a team of committed leaders. Meet the executives
            steering our mission forward.
          </h2>

          <div className="w-12 h-1 rounded-full bg-[#FFBE00]" />
        </div>

        <div className="flex w-full flex-col gap-6 text-left text-slate-700 text-[1.0625rem] leading-[1.75] sm:text-lg sm:leading-[1.8]">
          <p>
            As a student-led association dedicated to nurturing growth and excellence, we are
            committed to creating an environment where every student can develop their skills,
            deepen their knowledge, and unlock their full potential.
          </p>
          <p>
            It is with great honor and enthusiasm that we, the Executive Body of the Noble
            Association, extend our warmest welcome to you. We are privileged to support and
            guide you throughout your academic journey within the association and beyond.
          </p>
          <p>
            Our mission is to provide unwavering leadership, meaningful opportunities, and a
            community that empowers you to thrive both academically and personally. Your success
            remains our highest priority, and we look forward to contributing to your growth,
            achievements, and future impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Intro;
