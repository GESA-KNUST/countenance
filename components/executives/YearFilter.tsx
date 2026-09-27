'use client';

interface YearFilterProps {
  academicYears: string[];
  selectedYear: string | null;
  setSelectedYear: (year: string) => void;
  countsByYear: Record<string, number>;
}

const YearFilter = ({
  academicYears,
  selectedYear,
  setSelectedYear,
  countsByYear,
}: YearFilterProps) => {
  if (academicYears.length === 0) return null;

  return (
    <div className="bg-white px-8 sm:px-12 md:px-16 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Academic year
        </p>

        <div
          className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
          role="group"
          aria-label="Filter executives by academic year"
        >
          {academicYears.map((year) => {
            const active = year === selectedYear;
            return (
              <button
                key={year}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedYear(year)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer border ${
                  active
                    ? 'bg-[#FFBE00] text-black border-[#FFBE00]'
                    : 'bg-white text-[#252638] border-gray-300 hover:border-black'
                }`}
              >
                {year}
                <span className={active ? 'text-black/60 ml-1.5' : 'text-gray-400 ml-1.5'}>
                  {countsByYear[year]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YearFilter;
