'use client';
import { useState } from 'react';
import YearFilter from './YearFilter';
import Executives from './Executives';
import { executivesForYear, isCurrentYear, type Executive } from '@/lib/data/executive';

interface ExecutivesBrowserProps {
  executives: Executive[];
  academicYears: string[];
  countsByYear: Record<string, number>;
  currentYear: string | null;
}

const ExecutivesBrowser = ({
  executives,
  academicYears,
  countsByYear,
  currentYear,
}: ExecutivesBrowserProps) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const effectiveYear = selectedYear ?? currentYear ?? academicYears[0] ?? null;

  return (
    <>
      <YearFilter
        academicYears={academicYears}
        selectedYear={effectiveYear}
        setSelectedYear={setSelectedYear}
        countsByYear={countsByYear}
      />
      <Executives
        executives={executivesForYear(executives, effectiveYear)}
        isLoading={false}
        former={!isCurrentYear(effectiveYear, currentYear)}
      />
    </>
  );
};

export default ExecutivesBrowser;
