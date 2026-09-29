import { Star } from 'lucide-react';

const Intro = () => {
  return (
    <div className="bg-white px-6 py-14 sm:px-12 sm:py-16 md:p-16 lg:p-20 flex justify-center">
      <div className="flex flex-col items-center md:items-start gap-8 sm:gap-10 max-w-3xl w-full">
        <div className="flex flex-col items-center md:items-start gap-5 sm:gap-6 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-[#FFBE00]" fill="#FFBE00" />
            <h6 className="text-[#FFBE00] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] font-header">
              Meet our executives
            </h6>
            <Star className="w-3.5 h-3.5 text-[#FFBE00]" fill="#FFBE00" />
          </div>

          <h2 className="text-[1.6rem] leading-[1.25] sm:text-3xl md:text-4xl font-bold text-[#252638] font-header text-balance">
            Behind every success is a team of committed leaders&mdash;meet the executives
            steering our mission forward.
          </h2>

          <div className="w-12 h-1 rounded-full bg-[#FFBE00]" />
        </div>

        <div className="flex flex-col gap-5 text-left text-slate-700 text-[1.0625rem] sm:text-lg leading-[1.75] sm:leading-[1.8]">
          <p>
            As a student-led association dedicated to nurturing growth and excellence, we are
            committed to creating an environment where every student can develop their skills,
            deepen their knowledge, and unlock their full potential.
          </p>
          <p>
            It is with great honor and enthusiasm that we, the Executive Body of the Noble
            Association, extend our warmest welcome to you. We are privileged to support and
            guide you throughout your academic journey&mdash;within the association and beyond.
          </p>
          <p>
            Our mission is to provide unwavering leadership, meaningful opportunities, and a
            community that empowers you to thrive both academically and personally. Your success
            remains our highest priority, and we look forward to contributing to your growth,
            achievements, and future impact.
          </p>
        </div>

        <p className="w-full border-l-2 border-[#FFBE00] pl-5 font-header text-lg sm:text-xl font-bold text-[#252638] text-left">
          Together, we build, we learn, and we rise.
        </p>
      </div>
    </div>
  );
};

export default Intro;
