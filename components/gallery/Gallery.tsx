import GalleryCard from './GalleryCard';

const Gallery = () => {
  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-16 space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          <GalleryCard
            src="/images/img1.png"
            title="Campus Life"
            location="KNUST"
          />
          <GalleryCard
            src="/images/img2.png"
            title="Workshop"
            location="College of Engineering"
          />
          <GalleryCard
            src="/images/galleryImg.png"
            title="Event"
            location="Great Hall"
          />
          <GalleryCard
            src="/images/image 26.png"
            title="Community"
            location="Kumasi"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <GalleryCard
            src="/images/galleryImg.png"
            title="Tech Talk"
            location="Main Auditorium"
            large
          />
          <GalleryCard
            src="/images/image 26.png"
            title="Club Meeting"
            location="GESA Office"
            large
          />
          <GalleryCard
            src="/images/img1.png"
            title="Fun Games"
            location="Paajoe Stadium"
            large
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <GalleryCard
            src="/images/image 26.png"
            title="Networking"
            location="IDL Conference Center"
          />
          <GalleryCard
            src="/images/img2.png"
            title="Celebration"
            location="Royal Parade Grounds"
          />
          <GalleryCard
            src="/images/galleryImg.png"
            title="Awards Night"
            location="Great Hall"
          />
          <GalleryCard
            src="/images/img1.png"
            title="Freshmen Orientation"
            location="CCB"
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
