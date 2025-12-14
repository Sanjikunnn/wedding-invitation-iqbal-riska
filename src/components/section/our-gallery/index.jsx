import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo
} from "react";
import data from "../../../data/config.json";

const IMAGE_INTERVAL = 3000;

/* ======================================================
   ImageWithLoader — optimized for static images
   ====================================================== */
const ImageWithLoader = memo(
  ({ src, alt, className, onClick, loadingType = "lazy" }) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <div className="relative w-full h-full overflow-hidden bg-gray-900 rounded-md">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-800" />
        )}

        <img
          src={src}
          alt={alt}
          loading={loadingType}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onClick={onClick}
          className={`${className} transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    );
  }
);

/* ======================================================
   GalleryItem — LOAD 1 IMAGE ONLY (IMPORTANT)
   ====================================================== */
const GalleryItem = memo(({ images, isVertical, onSelect }) => {
  const [index, setIndex] = useState(0);

  // slideshow index
  useEffect(() => {
    if (!images?.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, IMAGE_INTERVAL);

    return () => clearInterval(timer);
  }, [images]);

  // preload next image (smooth transition)
  useEffect(() => {
    const nextSrc = images[(index + 1) % images.length];
    const img = new Image();
    img.src = nextSrc;
  }, [index, images]);

  const handleClick = useCallback(() => {
    onSelect(images, index);
  }, [images, index, onSelect]);

  return (
    <div
      onClick={handleClick}
      className={`relative w-full overflow-hidden cursor-pointer ${
        isVertical ? "h-64 mb-4" : "h-[200px]"
      }`}
    >
      <ImageWithLoader
        src={images[index]}
        alt={`gallery-${index}`}
        loadingType="lazy"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );
});

/* ======================================================
   AIGalleryItem — horizontal scroll (NO DUPLICATE LOAD)
   ====================================================== */
const AIGalleryItem = memo(({ images, onSelect }) => {
  return (
    <div className="relative w-full overflow-x-auto">
      <div className="flex gap-4 py-2">
        {images.map((src, i) => (
          <ImageWithLoader
            key={i}
            src={src}
            alt={`ai-${i}`}
            loadingType="lazy"
            className="w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 lg:w-56 lg:h-72 
                       object-cover rounded-md flex-shrink-0 cursor-pointer"
            onClick={() => onSelect(images, i)}
          />
        ))}
      </div>
    </div>
  );
});

/* ======================================================
   LazySection — real lazy mount
   ====================================================== */
const LazySection = ({ children, minHeight = 300 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight }}>
      {visible ? children : <div className="animate-pulse bg-gray-900 h-full rounded-md" />}
    </div>
  );
};

/* ======================================================
   MAIN — OurGallery
   ====================================================== */
export default function OurGallery() {
  const [activeSection, setActiveSection] = useState("portrait");
  const [lightbox, setLightbox] = useState({ images: [], index: null });

  const allImages = data.gallery || [];
  const aiImages = data.ai || [];

  const portraitImages = allImages.slice(0, 18);
  const landscapeImages = allImages.slice(18);

  const groupImages = useCallback((images, size) => {
    return Array.from(
      { length: Math.ceil(images.length / size) },
      (_, i) => images.slice(i * size, i * size + size)
    );
  }, []);

  const groupedPortrait = groupImages(portraitImages, 3);
  const groupedLandscape = groupImages(
    landscapeImages,
    Math.ceil(landscapeImages.length / 3)
  );

  const openLightbox = useCallback((images, index) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ images: [], index: null });
  }, []);

  const nextImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  }, []);

  useEffect(() => {
    if (lightbox.index === null) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.index, closeLightbox, nextImage]);

  const tabs = ["portrait", "landscape", "ai"];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mt-10 mb-4">Our Gallery</h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`px-4 py-1 rounded-md capitalize ${
              activeSection === tab
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {tab === "ai" ? "Foto AI" : tab}
          </button>
        ))}
      </div>

      {/* Portrait */}
      {activeSection === "portrait" && (
        <LazySection minHeight={400}>
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

      {/* Landscape */}
      {activeSection === "landscape" && (
        <LazySection minHeight={400}>
          <div className="flex flex-col">
            {groupedLandscape.map((group, i) => (
              <GalleryItem
                key={i}
                images={group}
                isVertical
                onSelect={openLightbox}
              />
            ))}
          </div>
        </LazySection>
      )}

      {/* AI */}
      {activeSection === "ai" && (
        <LazySection minHeight={300}>
          <AIGalleryItem images={aiImages} onSelect={openLightbox} />
        </LazySection>
      )}

      {/* Lightbox */}
      {lightbox.index !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
          onClick={closeLightbox}
        >
          <ImageWithLoader
            src={lightbox.images[lightbox.index]}
            alt="preview"
            loadingType="eager"
            className="max-w-[90%] max-h-[80%] rounded-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          />

          <div
            className="flex gap-2 mt-6 overflow-x-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.images.map((src, i) => (
              <img
                key={i}
                src={src}
                loading="lazy"
                onClick={() => setLightbox((p) => ({ ...p, index: i }))}
                className={`w-14 h-14 object-cover rounded-md cursor-pointer border ${
                  i === lightbox.index
                    ? "border-red-500"
                    : "border-transparent opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
