'use client';
import { useEffect, useState } from 'react';
import YearFilter from './YearFilter';
import Executives from './Executives';
import { executivesForYear, isCurrentYear, type Executive } from '@/lib/data/executive';

interface ExecutivesBrowserProps {
  executives: Executive[];
  academicYears: string[];
  countsByYear: Record<string, number>;
  currentYear: string | null;
}

const VIEW_KEY = 'executives:return';

const saveScroll = () => {
  try {
    sessionStorage.setItem(VIEW_KEY, String(window.scrollY));
  } catch {
    return;
  }
};

const takeScroll = () => {
  try {
    const raw = sessionStorage.getItem(VIEW_KEY);
    sessionStorage.removeItem(VIEW_KEY);
    const value = raw === null ? NaN : Number(raw);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
};

const ExecutivesBrowser = ({
  executives,
  academicYears,
  countsByYear,
  currentYear,
}: ExecutivesBrowserProps) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState<number | null>(null);
  const effectiveYear = selectedYear ?? currentYear ?? academicYears[0] ?? null;

  useEffect(() => {
    const year = new URLSearchParams(window.location.search).get('year');
    if (year && academicYears.includes(year)) setSelectedYear(year);

    setPendingScroll(takeScroll());
  }, [academicYears]);

  useEffect(() => {
    if (pendingScroll === null) return;

    window.scrollTo({ top: pendingScroll, behavior: 'auto' });
    setPendingScroll(null);
  }, [pendingScroll, effectiveYear]);

  const changeYear = (year: string) => {
    setSelectedYear(year);

    const url = isCurrentYear(year, currentYear)
      ? '/executives'
      : `/executives?year=${encodeURIComponent(year)}`;
    window.history.replaceState(null, '', url);
  };

  return (
    <>
      <YearFilter
        academicYears={academicYears}
        selectedYear={effectiveYear}
        setSelectedYear={changeYear}
        countsByYear={countsByYear}
      />
      <div onClickCapture={saveScroll}>
        <Executives
          executives={executivesForYear(executives, effectiveYear)}
          isLoading={false}
          former={!isCurrentYear(effectiveYear, currentYear)}
        />
      </div>
    </>
  );
};

export default ExecutivesBrowser;
