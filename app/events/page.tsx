'use client';
import { useState } from 'react';
import HeroSection from '../../components/events/HeroSection';
import RecentEvents from '../../components/events/RecentEvents';
import AllEvents from '../../components/events/AllEvents';
import useEventCollection from '../../hooks/useEventCollection';

const EventsPage = () => {
  const { data: events, isLoading, error } = useEventCollection();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((i) => (i === (events?.length ?? 0) - 1 ? 0 : i + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((i) => (i === 0 ? (events?.length ?? 0) - 1 : i - 1));
  };

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <HeroSection
        images={["/images/img1.png", "/images/img2.png", "/images/img1.png", "/images/img2.png"]}
        title="Upcoming"
        subtitle="Explore insights, innovations, and student experiences from the heart of KNUST’s engineering community."
        currentIndex={currentIndex}
        total={events?.length ?? 0}
        onNext={handleNext}
        onPrev={handlePrev}
        items={events ?? []}
      />

      <RecentEvents
        currentIndex={currentIndex}
        total={events?.length ?? 0}
        onNext={handleNext}
        onPrev={handlePrev}
        events={events ?? []}
      />

      <AllEvents />
    </div>
  );
};

export default EventsPage;
