'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import BlogCard from '../blog/BlogCard';

// Mock data for events
const events = [
  { id: 1, title: 'Event 1', category: 'Campaign Events', author: 'Master Logical' },
  { id: 2, title: 'Event 2', category: 'Election Events', author: 'Master Prince' },
  { id: 3, title: 'Event 3', category: 'Entertainment', author: 'Ebony Reigns' },
  { id: 4, title: 'Event 4', category: 'Worship', author: 'Bruce Lee' },
  { id: 5, title: 'Event 5', category: 'Campus Life', author: 'Master Joy' },
  { id: 6, title: 'Event 6', category: 'Campaign Events', author: 'Master Adu' },
  { id: 7, title: 'Event 7', category: 'Entertainment', author: 'Master Obrempong' },
  { id: 8, title: 'Event 8', category: 'Worship', author: 'Master Adu' },
  { id: 9, title: 'Event 9', category: 'Campus Life', author: 'Master Shifuu' },
];

const AllEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 flex flex-col xl:flex-row items-start gap-12">
      <div className="w-full xl:w-1/4">
        <div className="text-center xl:text-left">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight">
            All <br /> <span className="text-[#FFBE00]">Events</span>
          </h2>
          <p className="mt-8 text-lg sm:text-xl text-gray-700 mx-auto xl:mx-0">
            Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community.
          </p>

          <div className="mt-10 mx-auto xl:mx-0">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <input
                type="text"
                placeholder="Search Event"
                className="text-lg sm:text-xl outline-none w-full bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 text-2xl sm:text-3xl text-gray-500 my-10 xl:my-12 text-center xl:text-left">
          {['Campaign Events', 'Election Events', 'Entertainment', 'Worship', 'Campus Life'].map((category) => (
            <button
              key={category}
              type="button"
              className={`text-left ${selectedCategory === category ? 'text-black font-semibold' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredEvents.map((event) => (
          <BlogCard key={event.id} title={event.title} author={event.author} />
        ))}
      </div>
    </div>
  );
};

export default AllEvents;
