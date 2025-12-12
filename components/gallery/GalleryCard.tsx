import Image from "next/image";
import { ArrowRight } from "lucide-react";

const GalleryCard = ({ src, title, location, large = false }) => (
  <div
    className={`relative ${
      large ? "h-[660px]" : "h-[350px]"
    } w-full md:flex-1 group cursor-pointer overflow-hidden`}
  >
    <Image
      src={src}
      alt={title}
      layout="fill"
      objectFit="cover"
      className="group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
      <h3 className="text-xl md:text-2xl font-bold uppercase">{title}</h3>
      <p className="text-xs md:text-sm opacity-70 capitalize">{location}</p>
    </div>
    <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowRight size={28} />
    </div>
  </div>
);

export default GalleryCard;
