import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo
} from "react";
import data from "../../../data/config.json";
import { motion, useInView } from "framer-motion";

const IMAGE_INTERVAL = 3000;
/* ======================================================================
   MAIN COMPONENT — OurGallery (Optimized)
   ====================================================================== */
export default function OurGallery() {
  const [activeSection, setActiveSection] = useState("portrait");
  const [lightbox, setLightbox] = useState({ images: [], index: null });
  const [slideshowReady, setSlideshowReady] = useState(false);

  const allImages = data.gallery || [];
  const aiImages = data.ai || [];

  const galleryPortrait = allImages.slice(0, 18);
  const galleryLandscape = allImages.slice(18);

  const [globalIndex, setGlobalIndex] = useState(0);

  useEffect(() => {
  if (!slideshowReady) return;

  const interval = setInterval(() => {
    setGlobalIndex((i) => i + 1);
  }, IMAGE_INTERVAL);

  return () => clearInterval(interval);
}, [slideshowReady]);


  // Grouping
  const getGroupedImages = useCallback(
    (images, perGroup) =>
      Array.from(
        { length: Math.ceil(images.length / perGroup) },
        (_, i) => images.slice(i * perGroup, (i + 1) * perGroup)
      ),
    []
  );

  const groupedPortrait = getGroupedImages(galleryPortrait, 3);
  const groupedLandscape = getGroupedImages(
    galleryLandscape,
    Math.ceil(galleryLandscape.length / 3)
  );

  // Lightbox
  const openLightbox = useCallback((images, index) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ images: [], index: null });
  }, []);

  const showNext = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  }, []);

  useEffect(() => {
    if (lightbox.index === null) return;

    const handle = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lightbox.index, closeLightbox, showNext]);

  // Motion anim
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: false });

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.8 }
    })
  };

  const sections = ["portrait", "landscape", "ai"];

  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>

      <motion.h2
        ref={headerRef}
        className="text-xl leading-5 text-white font-bold font-cursive mt-10 mb-4"
        variants={headingVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        Our Gallery
      </motion.h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        {sections.map((section, i) => (
          <motion.button
            key={section}
            custom={i}
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

      {/* Sections */}
      {activeSection === "portrait" && (
        <LazySection
          height={400}
          onVisible={() => setSlideshowReady(true)}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {groupedPortrait.map((group, i) => (
              <GalleryItem
                key={i}
                images={group}
                isVertical={false}
                onSelect={openLightbox}
                globalIndex={globalIndex}
                
              />
            ))}
          </div>
        </LazySection>
      )}

      {activeSection === "landscape" && (
        <LazySection
          height={400}
          onVisible={() => setSlideshowReady(true)}
        >

          <div className="flex flex-col">
            {groupedLandscape.map((group, i) => (
              <GalleryItem
                key={i}
                images={group}
                isVertical={true}
                onSelect={openLightbox}
                globalIndex={globalIndex}

              />
            ))}
          </div>
        </LazySection>
      )}

      {activeSection === "ai" && (
        <LazySection height={300}>
          <AIGalleryItem images={aiImages} onSelect={openLightbox} />
        </LazySection>
      )}

      {/* Lightbox */}
      {lightbox.index !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <ImageWithLoader
            src={lightbox.images[lightbox.index]}
            alt="preview"
            loadingType="eager"
            className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
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
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-opacity ${
                  i === lightbox.index
                    ? "border-red-500"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/* ======================================================================
   COMPONENT: ImageWithLoader (dipakai oleh semua komponen)
   ====================================================================== */
const ImageWithLoader = memo(({ src, alt, className, onClick, loadingType = "lazy" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-md z-10" />
      )}

      <img
        src={src}
        alt={alt}
        loading={loadingType}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onClick={onClick}
        className={`${className} transition-[filter] duration-500 ${
          loaded ? "blur-0" : "blur-md scale-[1.02]"
        }`}
      />
    </div>
  );
});


/* ======================================================================
   GalleryItem (Portrait & Landscape)
   ====================================================================== */
const GalleryItem = memo(({ images, isVertical, onSelect, globalIndex }) => {
  const index = globalIndex % images.length;

  const handleClick = useCallback(
    () => onSelect(images, index),
    [images, index, onSelect]
  );

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md cursor-pointer select-none ${
        isVertical ? "h-64 mb-4" : "h-[200px]"
      }`}
      onClick={handleClick}
    >
      {images.map((src, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            opacity: index === i ? 1 : 0,
            zIndex: index === i ? 10 : 1
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ImageWithLoader
            src={src}
            alt={`gallery-${i}`}
            loadingType={i === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover rounded-md"
          />
        </motion.div>
      ))}
    </div>
  );
});


/* ======================================================================
   AIGalleryItem — scroll horizontal
   ====================================================================== */
const AIGalleryItem = memo(({ images, onSelect }) => {
  const doubled = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <div className="flex w-max animate-scrollX gap-4">
        {doubled.map((src, i) => (
          <ImageWithLoader
            key={i}
            src={src}
            alt={`ai-${i}`}
            loadingType="lazy"
            className="w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 lg:w-56 lg:h-72 
                       object-cover rounded-md flex-shrink-0 cursor-pointer"
            onClick={() => onSelect(images, i % images.length)}
          />
        ))}
      </div>
    </div>
  );
});

/* ======================================================================
   LazySection — hanya load saat terlihat
   ====================================================================== */
  const LazySection = ({ children, height = 300, onVisible }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          onVisible?.(); // 🔥 kasih sinyal
          obs.disconnect();
        }
      },
      { rootMargin: "80px" }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [onVisible]);


  return (
    <div ref={ref} style={{ minHeight: height }}>
      {visible ? (
        children
      ) : (
        <div className="animate-pulse bg-gray-900 rounded-md w-full h-full" />
      )}
    </div>
  );
};


