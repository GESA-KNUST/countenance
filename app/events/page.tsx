'use client';
import { useState } from 'react';
import heroImage from '../../public/images/image 26.png';
import HeroSection from '../../components/events/HeroSection';
import RecentEvents from '../../components/events/RecentEvents';
import AllEvents from '../../components/events/AllEvents';

const EventsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const blogPosts = [
    { id: 1, title: 'First Event' },
    { id: 2, title: 'Second Event' },
    { id: 3, title: 'Third Event' },
    { id: 4, title: 'Fourth Event' },
    { id: 5, title: 'Fifth Event' },
  ];

  const handleNext = () =>
    setCurrentIndex((i) => (i === blogPosts.length - 1 ? 0 : i + 1));
  const handlePrev = () =>
    setCurrentIndex((i) => (i === 0 ? blogPosts.length - 1 : i - 1));

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <HeroSection
        heroImage={heroImage}
        title="Upcoming"
        subtitle="Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community."
        currentIndex={currentIndex}
        total={blogPosts.length}
        onNext={handleNext}
        onPrev={handlePrev}
        items={blogPosts} 
      />

      <RecentEvents
        currentIndex={currentIndex}
        total={blogPosts.length}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      <AllEvents />
    </div>
  );
};

export default EventsPage;
