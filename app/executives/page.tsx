'use client';
import { useState, useMemo } from 'react';
import Hero from '../../components/executives/Hero';
import Intro from '../../components/executives/Intro';
import Executives from '../../components/executives/Executives';
import YearFilter from '../../components/executives/YearFilter';
import { useExecutiveCollection } from '../../hooks/useExecutiveCollection';
import { sortAcademicYears } from '@/lib/data/executive';
import EmptyState from '@/components/events/EmptyState';
import { TriangleAlert } from 'lucide-react';

const ExecutivesPage = () => {
  const { executives, isLoading, error } = useExecutiveCollection();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const academicYears = useMemo(
    () => sortAcademicYears([...new Set(executives.map((exec) => exec.academicYear))]),
    [executives]
  );

  const countsByYear = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const exec of executives) {
      counts[exec.academicYear] = (counts[exec.academicYear] ?? 0) + 1;
    }
    return counts;
  }, [executives]);

  // Fall back to the most recent year until the user picks one, instead of
  // calling setState during render.
  const effectiveYear = selectedYear ?? academicYears[0] ?? null;

  const filteredExecutives = useMemo(() => {
    if (!effectiveYear) return [];
    return executives.filter((exec) => exec.academicYear === effectiveYear);
  }, [executives, effectiveYear]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <EmptyState
          title="Failed to Load Executives"
          message="We encountered an issue loading the executives. Please try again later."
          icon={TriangleAlert}
          showHomeButton={true}
          onRefresh={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <Intro />
      <section id="executives" className="scroll-mt-4">
        <YearFilter
          academicYears={academicYears}
          selectedYear={effectiveYear}
          setSelectedYear={setSelectedYear}
          countsByYear={countsByYear}
        />
        <Executives executives={filteredExecutives} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default ExecutivesPage;
