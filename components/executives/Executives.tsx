
import ExecutiveCard from './ExecutiveCard';

const executives = [
  {
    image: '/images/author.jpg',
    name: 'John Doe',
    position: 'President',
  },
  {
    image: '/images/author.jpg',
    name: 'Jane Doe',
    position: 'Vice President',
  },
  {
    image: '/images/author.jpg',
    name: 'Peter Jones',
    position: 'Secretary',
  },
  {
    image: '/images/author.jpg',
    name: 'Susan Smith',
    position: 'Treasurer',
  },
  {
    image: '/images/author.jpg',
    name: 'David Williams',
    position: 'Public Relations Officer',
  },
  {
    image: '/images/author.jpg',
    name: 'Sarah Brown',
    position: 'Academic Officer',
  },
  {
    image: '/images/author.jpg',
    name: 'Michael Davis',
    position: 'Sports Chairman',
  },
  {
    image: '/images/author.jpg',
    name: 'Emily Wilson',
    position: 'Entertainment Chairman',
  },
  {
    image: '/images/author.jpg',
    name: 'Chris Taylor',
    position: 'SRC Rep',
  }
];

const Executives = () => {
  return (
    <div className="bg-white p-8 sm:p-12 md:p-16 lg:p-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {executives.map((executive, index) => (
          <ExecutiveCard
            key={index}
            image={executive.image}
            name={executive.name}
            position={executive.position}
          />
        ))}
      </div>
    </div>
  );
};

export default Executives;
