'use client';

import { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';

interface IntroProps {
  academicYears: string[];
  selectedYear: string | null;
  setSelectedYear: (year: string) => void;
}

const Intro: React.FC<IntroProps> = ({ academicYears, selectedYear, setSelectedYear }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white p-8 sm:p-12 md:p-16 lg:p-20 flex justify-center">
      <div className="flex flex-col items-center text-center md:items-start md:text-left gap-12 max-w-4xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 mx-auto md:mx-0">
            <Star className="w-3.5 h-3.5 text-[#FFBE00]" fill="#FFBE00" />
            <h6 className="text-[#FFBE00] font-bold text-sm uppercase font-header">Meet OUR EXECUTIVES</h6>
            <Star className="w-3.5 h-3.5 text-[#FFBE00]" fill="#FFBE00" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#252638] leading-snug font-header">
            Behind every success is a team of committed leaders—meet the executives steering our mission forward.
          </h2>
          <div className="w-12 h-1 bg-[#FFBE00] mx-auto md:mx-0" />
        </div>
        <p className="text-lg sm:text-xl text-black">
          As a student-led association dedicated to nurturing growth and excellence, we are committed to creating an environment where every student can develop their skills, deepen their knowledge, and unlock their full potential. It is with great honor and enthusiasm that we, the Executive Body of the Noble Association, extend our warmest welcome to you. We are privileged to support and guide you throughout your academic journey—within the association and beyond. Our mission is to provide unwavering leadership, meaningful opportunities, and a community that empowers you to thrive both academically and personally. Your success remains our highest priority, and we look forward to contributing to your growth, achievements, and future impact. Together, we build, we learn, and we rise.
        </p>

        <div className="relative inline-block text-left mx-auto md:mx-0">
          <div>
            <button
              type="button"
              className="bg-[#FFBE00] text-black px-4 py-3 rounded-lg font-semibold flex items-center gap-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedYear ? `${selectedYear} Executives` : 'Select Year'}</span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {isDropdownOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                {academicYears.map((year) => (
                  <a
                    href="#"
                    key={year}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      handleYearSelect(year);
                    }}
                  >
                    {`${year} Executives`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
