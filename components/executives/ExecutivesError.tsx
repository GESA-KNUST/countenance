'use client';
import { TriangleAlert } from 'lucide-react';
import EmptyState from '@/components/events/EmptyState';

const ExecutivesError = () => (
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

export default ExecutivesError;
