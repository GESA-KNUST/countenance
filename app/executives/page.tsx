'use client';
import { useState, useMemo } from 'react';
import Hero from '../../components/executives/Hero';
import Intro from '../../components/executives/Intro';
import Executives from '../../components/executives/Executives';
import { useExecutiveCollection } from '../../hooks/useExecutiveCollection';
import EmptyState from '@/components/events/EmptyState';
import { TriangleAlert } from 'lucide-react';

const ExecutivesPage = () => {
  const { executives, isLoading, error } = useExecutiveCollection();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const academicYears = useMemo(() => {
    return [...new Set(executives.map((exec) => exec.academicYear))];
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
      <Intro
        academicYears={academicYears}
        selectedYear={effectiveYear}
        setSelectedYear={setSelectedYear}
      />
      <Executives executives={filteredExecutives} isLoading={isLoading} />
    </div>
  );
};

export default ExecutivesPage;
