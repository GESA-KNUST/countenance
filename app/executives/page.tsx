'use client';
import { useState, useMemo } from 'react';
import Hero from '../../components/executives/Hero';
import Intro from '../../components/executives/Intro';
import Executives from '../../components/executives/Executives';
import { useExecutiveCollection } from '../../hooks/useExecutiveCollection';

const ExecutivesPage = () => {
  const { executives, isLoading } = useExecutiveCollection();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const academicYears = useMemo(() => {
    if (executives.length === 0) return [];
    const years = [...new Set(executives.map((exec) => exec.academicYear))];
    if (!selectedYear) {
      setSelectedYear(years[0]);
    }
    return years;
  }, [executives, selectedYear]);

  const filteredExecutives = useMemo(() => {
    if (!selectedYear) return [];
    return executives.filter((exec) => exec.academicYear === selectedYear);
  }, [executives, selectedYear]);

  return (
    <div>
      <Hero />
      <Intro
        academicYears={academicYears}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <Executives executives={filteredExecutives} isLoading={isLoading} />
    </div>
  );
};

export default ExecutivesPage;
