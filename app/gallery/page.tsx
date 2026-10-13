import Gallery from '../../components/gallery/Gallery';
import GalleryHero from '../../components/gallery/Hero';
import { getGalleriesSafe } from '@/lib/data/gallery';

const GalleryPage = async () => {
  const galleries = await getGalleriesSafe();

  return (
    <div>
      <GalleryHero />
      <div id="gallery">
        <Gallery initialGalleries={galleries} />
      </div>
    </div>
  );
};

export default GalleryPage;
