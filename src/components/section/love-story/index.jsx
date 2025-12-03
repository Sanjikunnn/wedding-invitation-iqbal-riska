import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  memo,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../../data/config.json";

const IMAGE_INTERVAL = 3000;

/* ---------------------------
   LoveItem (memoized)
   - Hanya render 1 <img> aktif
   - Guard terhadap imageList undefined / kosong
   - Preload next image handled in parent (but keep local next preload too)
----------------------------*/
const LoveItem = memo(function LoveItem({
  imageList = [],
  title = "",
  duration = "",
  description = "",
  tagline = "",
  cliffhanger = "",
  dialogs = [],
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const mountedRef = useRef(false);

  // slideshow interval (start only if have images)
  useEffect(() => {
    if (!imageList || imageList.length === 0) return;
    mountedRef.current = true;

    const interval = setInterval(() => {
      setImageIndex((prev) => (imageList.length ? (prev + 1) % imageList.length : 0));
    }, IMAGE_INTERVAL);

    return () => {
      clearInterval(interval);
      mountedRef.current = false;
    };
  }, [imageList]);

  // preload next image locally (extra safety)
  useEffect(() => {
    if (!imageList || imageList.length === 0) return;
    const next = (imageIndex + 1) % imageList.length;
    const img = new Image();
    img.src = imageList[next];
  }, [imageIndex, imageList]);

  const shortDesc = useMemo(() => {
    if (!description) return "";
    return description.length > 120 ? description.slice(0, 120) + "..." : description;
  }, [description]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      className="bg-black bg-opacity-30 p-3 rounded-lg"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Slideshow: render only active image to keep DOM light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative w-full h-[120px] sm:h-[180px] md:h-[250px] lg:h-[300px] rounded-md overflow-hidden"
        >
          {imageList && imageList.length > 0 ? (
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={imageIndex}
                src={imageList[imageIndex]}
                alt={`${title ?? "slide"} ${imageIndex + 1}`}
                loading="lazy"
                fetchpriority={imageIndex === 0 ? "high" : "low"}
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-800/60 rounded-md flex items-center justify-center text-xs text-gray-300">
              No Image
            </div>
          )}
        </motion.div>

        {/* Title + Tagline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="my-auto text-center md:text-left">
            <p className="text-white mb-1 tracking-tighter font-semibold">{title}</p>
            {duration && <p className="text-xs text-[#A3A1A1]">{duration}</p>}
            {tagline && <p className="text-xs italic text-gray-300 mt-1">"{tagline}"</p>}
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-[#A3A1A1] text-xs mt-2"
      >
        {expanded ? description : shortDesc}
      </motion.p>

      {/* Dialogs (only when expanded) */}
      <AnimatePresence>
        {expanded && dialogs && dialogs.length > 0 && (
          <motion.div
            className="mt-4 space-y-3"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.18, delayChildren: 0.2 },
              },
            }}
          >
            {dialogs.map((dialog, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                className={`flex ${dialog.role === "leader" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative px-2 py-1 max-w-[70%] text-xs shadow-md ${
                    dialog.role === "leader"
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl rounded-br-sm"
                      : "bg-white/10 text-gray-200 rounded-2xl rounded-bl-sm"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-wide font-semibold opacity-70 mb-1">
                    {dialog.name}
                  </p>
                  <p className="leading-snug">{dialog.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand button */}
      {description?.length > 120 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded((s) => !s)}
          className="text-gray-400 text-xs mt-1 underline"
        >
          {expanded ? "Sembunyikan" : "Lihat Selengkapnya"}
        </motion.button>
      )}

      {/* Cliffhanger */}
      {cliffhanger && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-red-400 text-xs mt-2 italic"
        >
          — {cliffhanger}
        </motion.p>
      )}
    </motion.div>
  );
});

/* ---------------------------
   Parent: LoveStory
   - Memoize episodes
   - Preload only current + next episode images
   - Map props explicitly to LoveItem
----------------------------*/
export default function LoveStory() {
  const [currentPage, setCurrentPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef(null);

  // memoize episodes so reference won't change on rerenders
  const episodes = useMemo(() => data.love_story ?? [], []);
  const totalPages = episodes.length;

  // safe current episode (guard index)
  const currentEpisode = useMemo(() => {
    if (!episodes || episodes.length === 0) return null;
    const idx = Math.min(Math.max(currentPage, 0), episodes.length - 1);
    return episodes[idx] ?? null;
  }, [episodes, currentPage]);

  // Preload images for current episode + next episode (minimal)
  useEffect(() => {
    if (!currentEpisode) return;

    const preloadList = (list) => {
      if (!list || list.length === 0) return;
      // preload only first image + next image to keep it minimal
      const first = list[0];
      const next = list[1 % list.length];
      if (first) {
        const i = new Image();
        i.src = first;
      }
      if (next) {
        const j = new Image();
        j.src = next;
      }
    };

    preloadList(currentEpisode.image_list);
    const nextEp = episodes[(currentPage + 1) % episodes.length];
    if (nextEp) preloadList(nextEp.image_list);
  }, [currentEpisode, episodes, currentPage]);

  const handlePrev = useCallback(() => {
    setCurrentPage((p) => (p > 0 ? p - 1 : p));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : p));
  }, [totalPages]);

  // observer only for animKey (header animation)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimKey((k) => k + 1);
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="w-full h-[3px] bg-red-500" />

      <motion.h2
        key={animKey}
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-xl tracking-widest leading-5 text-white font-bold font-cursive mb-4 mt-10"
      >
        Our Love Story
      </motion.h2>

      {/* only render LoveItem when currentEpisode exists */}
      <AnimatePresence mode="wait">
        {currentEpisode && (
          <LoveItem
            key={`${currentPage}-${animKey}`}
            imageList={currentEpisode.image_list ?? []}
            title={currentEpisode.title ?? ""}
            duration={currentEpisode.duration ?? ""}
            tagline={currentEpisode.tagline ?? ""}
            description={currentEpisode.description ?? ""}
            cliffhanger={currentEpisode.cliffhanger ?? ""}
            dialogs={currentEpisode.dialogs ?? []}
          />
        )}
      </AnimatePresence>

      {/* Pagination */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <p className="text-white text-sm">
            Episode {Math.min(currentPage + 1, totalPages)} / {totalPages}
          </p>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot Navigation */}
        <div className="flex gap-2">
          {episodes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-transform duration-150 ${
                idx === currentPage ? "bg-red-500 scale-110" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
