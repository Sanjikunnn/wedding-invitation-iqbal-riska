import React, { useState, useEffect } from 'react';
import data from '../../../data/config.json';

const IMAGE_INTERVAL = 3000; // Ganti gambar tiap 3 detik

const GalleryItem = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[200px] overflow-hidden rounded-md">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`gallery-${i}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === i ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
    </div>
  );
};

export default function OurGallery() {
  const galleryImages = data.gallery || [];
  const columns = 6;
  const imagesPerColumn = 3;

  // Bagi 18 gambar jadi 6 grup isi 3
  const groupedImages = Array.from({ length: columns }, (_, i) =>
    galleryImages.slice(i * imagesPerColumn, (i + 1) * imagesPerColumn)
  );

  return (
    <div>
      <h2 className="text-xl leading-5 text-white font-bold font-cursive mt-10 mb-4">
        Our Gallery
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {groupedImages.map((group, index) => (
          <GalleryItem key={index} images={group} />
        ))}
      </div>
    </div>
  );
}
