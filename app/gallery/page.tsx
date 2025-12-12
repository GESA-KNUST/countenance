'use client'
import Gallery from '../../components/gallery/Gallery';
import GalleryHero from '../../components/gallery/Hero';

const GalleryPage = () => {
  return (
    <div>
      <GalleryHero />
      <div id="gallery">
        <Gallery />
      </div>
    </div>
  );
};

export default GalleryPage;
