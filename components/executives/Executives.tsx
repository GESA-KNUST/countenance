import ExecutiveCard from './ExecutiveCard';
import SkeletonLoadingCard from './SkeletonLoadingCard';

interface ItemsProps {
  _id: string;
  academicYear: string;
  executivePositionHeld: string;
  fullName: string;
  officialImage: {
    title: string;
    description: string;
    url: string;
  };
}

interface ExecutivesProps {
  executives: ItemsProps[];
  isLoading: boolean;
}

const Executives = ({ executives, isLoading }: ExecutivesProps) => {
  return (
    <div className="bg-white p-8 sm:p-12 md:p-16 lg:p-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <SkeletonLoadingCard key={index} />
            ))
          : executives.map((executive) => (
              <ExecutiveCard
                key={executive._id}
                image={executive.officialImage.url}
                name={executive.fullName}
                position={executive.executivePositionHeld}
              />
            ))}
      </div>
    </div>
  );
};

export default Executives;
