import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../../data/config.json";

const IMAGE_INTERVAL = 3000;

const LoveItem = ({
  imageList,
  title,
  duration,
  description,
  tagline,
  cliffhanger,
  dialogs,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!imageList || imageList.length === 0) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % imageList.length);
    }, IMAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [imageList]);

  // preload gambar berikutnya
  useEffect(() => {
    if (!imageList || imageList.length === 0) return;
    const nextIndex = (imageIndex + 1) % imageList.length;
    const img = new Image();
    img.src = imageList[nextIndex];
  }, [imageIndex, imageList]);

  const shortDesc =
    description?.length > 120 ? description.slice(0, 120) + "..." : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="bg-black bg-opacity-30 p-3 rounded-lg"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Slideshow Gambar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[120px] sm:h-[180px] md:h-[250px] lg:h-[300px] rounded-md overflow-hidden"
        >
          {imageList.map((img, idx) => (
            <motion.img
              key={idx}
              loading="lazy"
              src={img}
              alt={`Slide ${idx + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: idx === imageIndex ? 1 : 0,
                scale: idx === imageIndex ? 1 : 1.05,
              }}
              transition={{ duration: 1 }}
              style={{ zIndex: idx === imageIndex ? 10 : 0 }}
            />
          ))}
        </motion.div>

        {/* Title + Tagline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="my-auto text-center md:text-left">
            <p className="text-white mb-1 tracking-tighter font-semibold">
              {title}
            </p>
            {duration && <p className="text-xs text-[#A3A1A1]">{duration}</p>}
            {tagline && (
              <p className="text-xs italic text-gray-300 mt-1">"{tagline}"</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Deskripsi */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-[#A3A1A1] text-xs mt-2"
      >
        {expanded ? description : shortDesc}
      </motion.p>

      {/* Dialog hanya tampil kalau expanded */}
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
                transition: { staggerChildren: 0.2, delayChildren: 0.5},
              },
            }}
          >
            {dialogs.map((dialog, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className={`flex ${
                  dialog.role === "leader" ? "justify-end" : "justify-start"
                }`}
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

      {/* Tombol expand */}
      {description?.length > 120 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(!expanded)}
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
          transition={{ delay: 1.2 }}
          className="text-red-400 text-xs mt-2 italic"
        >
          — {cliffhanger}
        </motion.p>
      )}
    </motion.div>
  );
};

export default function LoveStory() {
  const [currentPage, setCurrentPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef(null);

  const episodes = data.love_story || [];
  const totalPages = episodes.length;
  const currentEpisode = episodes[currentPage];

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // refresh animasi tiap section masuk viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimKey((k) => k + 1);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="w-full h-[3px] bg-red-500"></div>
      <motion.h2
        key={animKey}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xl tracking-widest leading-5 text-white font-bold font-cursive mb-4 mt-10"
      >
        Our Love Story
      </motion.h2>

      {/* Render hanya episode aktif */}
      <AnimatePresence mode="wait">
        {currentEpisode && (
          <LoveItem
            key={`${currentPage}-${animKey}`}
            title={currentEpisode.title}
            imageList={currentEpisode.image_list}
            duration={currentEpisode.duration || ""}
            tagline={currentEpisode.tagline}
            description={currentEpisode.description}
            cliffhanger={currentEpisode.cliffhanger}
            dialogs={currentEpisode.dialogs}
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
            Episode {currentPage + 1} / {totalPages}
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
              className={`w-2.5 h-2.5 rounded-full transition ${
                idx === currentPage
                  ? "bg-red-500 scale-110"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
