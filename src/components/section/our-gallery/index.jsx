import React, { useState, useEffect } from "react";
import data from "../../../data/config.json";

const IMAGE_INTERVAL = 3000;

/* =========================
   GalleryItem (Portrait/Landscape)
   ========================= */
const GalleryItem = ({ images, isVertical, onSelect }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md cursor-pointer ${
        isVertical ? "h-64 mb-4" : "h-[200px]"
      }`}
      onClick={() => onSelect(images, index)}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`gallery-${i}`}
          // Gambar pertama jangan lazy, sisanya boleh
          loading={i === 0 ? "eager" : "lazy"}
          fetchpriority={i === 0 ? "high" : "auto"}
          decoding="async"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === i ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

    </div>
  );
};

/* =========================
   AIGalleryItem (Auto-scroll horizontal tanpa lib)
   ========================= */
const AIGalleryItem = ({ images, onSelect }) => {
  const doubled = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <div className="flex w-max animate-scrollX gap-4">
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`ai-gallery-${i}`}
            loading="lazy"
            decoding="async"
            onClick={() => onSelect(images, i % images.length)}
            className="w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 lg:w-56 lg:h-72 
                       object-cover rounded-md flex-shrink-0 shadow-md cursor-pointer hover:scale-105 transition-transform"
          />
        ))}
      </div>
    </div>
  );
};

/* =========================
   OurGallery (Main Component)
   ========================= */
export default function OurGallery() {
  const [activeSection, setActiveSection] = useState("portrait");
  const [lightbox, setLightbox] = useState({ images: [], index: null });

  const allImages = data.gallery || [];
  const aiImages = data.ai || [];

  const galleryPortrait = allImages.slice(0, 18);
  const galleryLandscape = allImages.slice(18);

  const getGroupedImages = (images, perGroup) =>
    Array.from(
      { length: Math.ceil(images.length / perGroup) },
      (_, i) => images.slice(i * perGroup, (i + 1) * perGroup)
    );

  const groupedPortrait = getGroupedImages(galleryPortrait, 3);
  const groupedLandscape = getGroupedImages(
    galleryLandscape,
    Math.ceil(galleryLandscape.length / 3)
  );

  const openLightbox = (images, index) => {
    setLightbox({ images, index });
  };

  const closeLightbox = () => {
    setLightbox({ images: [], index: null });
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  };

  // Keyboard support
  useEffect(() => {
    if (lightbox.index === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext(e);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>
      <h2 className="text-xl leading-5 text-white font-bold font-cursive mt-10 mb-4">
        Our Gallery
      </h2>

      {/* Tombol Navigasi Section */}
      <div className="flex justify-center space-x-4 mb-4">
        {["portrait", "landscape", "ai"].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-1 rounded-md capitalize ${
              activeSection === section
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {section === "ai" ? "Foto AI" : section}
          </button>
        ))}
      </div>

      {/* Gallery Section */}
      {activeSection === "portrait" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {groupedPortrait.map((group, i) => (
            <GalleryItem
              key={i}
              images={group}
              isVertical={false}
              onSelect={openLightbox}
            />
          ))}
        </div>
      )}

      {activeSection === "landscape" && (
        <div className="flex flex-col">
          {groupedLandscape.map((group, i) => (
            <GalleryItem
              key={i}
              images={group}
              isVertical={true}
              onSelect={openLightbox}
            />
          ))}
        </div>
      )}

      {activeSection === "ai" && (
        <div className="flex flex-col gap-4">
          <AIGalleryItem images={aiImages} onSelect={openLightbox} />
        </div>
      )}

      {/* Lightbox / Modal */}
      {lightbox.index !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
          onClick={closeLightbox}
        >
          {/* Gambar utama (klik gambar untuk Next) */}
          <img
            src={lightbox.images[lightbox.index]}
            alt="preview"
            width={1200}
            height={800}
            onClick={(e) => {
              e.stopPropagation();
              showNext(e);
            }}
            className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg cursor-pointer 
                      transform transition-all duration-300 hover:scale-[1.02]"
          />


          {/* Thumbnails */}
          <div
            className="flex gap-2 mt-6 overflow-x-auto px-4 py-2 bg-black/40 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`thumb-${i}`}
                onClick={() =>
                  setLightbox((prev) => ({ ...prev, index: i }))
                }
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                  i === lightbox.index
                    ? "border-red-500"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
