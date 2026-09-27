import ExecutiveCard from './ExecutiveCard';
import SkeletonLoadingCard from './SkeletonLoadingCard';
import EmptyState from '../events/EmptyState';
import { Users } from 'lucide-react';
import type { Executive } from '@/lib/data/executive';

interface ExecutivesProps {
  executives: Executive[];
  isLoading: boolean;
}

const Executives = ({ executives, isLoading }: ExecutivesProps) => {
  return (
    <div className="bg-white px-8 pb-8 sm:px-12 sm:pb-12 md:px-16 md:pb-16 lg:px-20 lg:pb-20">
      {!isLoading && executives.length === 0 ? (
        <EmptyState
          title="No Executives Found"
          message="There are no executives to display for this academic year."
          icon={Users}
          showHomeButton={false}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {isLoading
            ? Array.from({ length: 9 }).map((_, index) => <SkeletonLoadingCard key={index} />)
            : executives.map((executive) => (
              <ExecutiveCard key={executive.sys.id} executive={executive} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Executives;
