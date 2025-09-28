import React, { useState, useRef, useEffect, useCallback, memo, Suspense } from "react";
import data from "../../../data/config.json";
import { motion, useInView } from "framer-motion";

const IMAGE_INTERVAL = 3000;

/* =========================
   GalleryItem (Portrait/Landscape)
   ========================= */
const GalleryItem = memo(({ images, isVertical, onSelect }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images?.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [images]);

  const handleClick = useCallback(() => {
    requestAnimationFrame(() => onSelect(images, index));
  }, [images, index, onSelect]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md cursor-pointer ${
        isVertical ? "h-64 mb-4" : "h-[200px]"
      }`}
      onClick={handleClick}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`gallery-${i}`}
          loading={i === 0 ? "eager" : "lazy"}
          fetchpriority={i === 0 ? "high" : "auto"}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === i ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}
    </div>
  );
});

/* =========================
   AIGalleryItem (Auto-scroll horizontal tanpa lib)
   ========================= */
const AIGalleryItem = memo(({ images, onSelect }) => {
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
});

/* =========================
   LazySection (observer)
   ========================= */
const LazySection = ({ children, height = 300 }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {visible ? children : <div className="animate-pulse bg-gray-800 rounded-md h-full w-full" />}
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

  const getGroupedImages = useCallback((images, perGroup) =>
    Array.from(
      { length: Math.ceil(images.length / perGroup) },
      (_, i) => images.slice(i * perGroup, (i + 1) * perGroup)
    ), []);

  const groupedPortrait = getGroupedImages(galleryPortrait, 3);
  const groupedLandscape = getGroupedImages(
    galleryLandscape,
    Math.ceil(galleryLandscape.length / 3)
  );

  const openLightbox = useCallback((images, index) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ images: [], index: null });
  }, []);

  const showNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  }, []);

  useEffect(() => {
    if (lightbox.index === null) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext(e);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox.index, closeLightbox, showNext]);

  // ===== Framer Motion refs & variants =====
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: false });

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.8 },
    }),
  };

  const sections = ["portrait", "landscape", "ai"];

  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>

      {/* ===== Heading ===== */}
      <motion.h2
        ref={headerRef}
        className="text-xl leading-5 text-white font-bold font-cursive mt-10 mb-4"
        variants={headingVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        Our Gallery
      </motion.h2>

      {/* ===== Tombol Navigasi Section ===== */}
      <div className="flex justify-center space-x-4 mb-4">
        {sections.map((section, index) => (
          <motion.button
            key={section}
            custom={index}
            variants={buttonVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-1 rounded-md capitalize transition-colors ${
              activeSection === section
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {section === "ai" ? "Foto AI" : section}
          </motion.button>
        ))}
      </div>

      {/* Gallery Sections */}
      {activeSection === "portrait" && (
        <LazySection height={400}>
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
        </LazySection>
      )}

      {activeSection === "landscape" && (
        <LazySection height={400}>
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
        </LazySection>
      )}

      {activeSection === "ai" && (
        <LazySection height={300}>
          <div className="flex flex-col gap-4">
            <AIGalleryItem images={aiImages} onSelect={openLightbox} />
          </div>
        </LazySection>
      )}

      {/* Lightbox / Modal */}
      {lightbox.index !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <img
            src={lightbox.images[lightbox.index]}
            alt="preview"
            width={1200}
            height={800}
            loading="eager"
            fetchpriority="high"
            onClick={(e) => {
              e.stopPropagation();
              showNext(e);
            }}
            className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg cursor-pointer 
                      transform transition-transform duration-300 hover:scale-[1.02] will-change-transform"
          />
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
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-opacity ${
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

