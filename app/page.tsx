import Personality from "../components/home/Personality";
import HeroSection from "../components/home/HeroSection";
import React from "react";
import RecentEvent from "../components/home/RecentEvent";
import Gallery from "../components/home/Gallery";
import img1 from "../public/images/img1.png"
import img2 from "../public/images/img2.png";

const Home = () => {
  return (
    <div className="font-poppins min-h-screen">
      <HeroSection
        title="Innovating Tomorrow's Engineers, Today"
        highlight="Engineers"
        images={[img1.src, img2.src, img1.src]}
      />
      <Personality />
      <RecentEvent />
      <Gallery />
    </div>
  );
};

export default Home;
