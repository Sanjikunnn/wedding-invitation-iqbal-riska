import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import data from "../../../data/config.json";

export default function BreakingNews() {
  const sectionRef = useRef(null);
  const controls = useAnimation();

  const [inView, setInView] = useState(false);
  const [direction, setDirection] = useState(1);
  const [cachedImages, setCachedImages] = useState([]);

  /* ============================================
     IMAGE LIST (memoized, super ringan)
  ============================================ */
  const images = useMemo(() => data.breaking_news_img || [], []);

  /* ============================================
     LOCAL CACHE URL (super ringan, bukan blob)
  ============================================ */
  useEffect(() => {
    const cached = images.map((url) => {
      const key = `bn-${url}`;
      const saved = localStorage.getItem(key);
      if (!saved) localStorage.setItem(key, url);
      return saved || url;
    });

    setCachedImages(cached);
  }, [images]);

  /* ============================================
     PRECONNECT CDN (i.ibb.co.com)
  ============================================ */
  useEffect(() => {
    const hint = document.createElement("link");
    hint.rel = "preconnect";
    hint.href = "https://i.ibb.co.com";
    document.head.appendChild(hint);
  }, []);

  /* ============================================
     OBSERVER (jalan hanya saat terlihat)
  ============================================ */
  useEffect(() => {
    let timeout = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setInView(entry.isIntersecting);
        }, 150);
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ============================================
     INFINITE SLIDE (ping-pong)
  ============================================ */
  useEffect(() => {
    if (!inView) return controls.stop();

    let active = true;

    const loop = async () => {
      while (active) {
        await controls.start({
          x: direction > 0 ? "-50%" : "0%",
          transition: { duration: 32, ease: "linear" },
        });
        setDirection((d) => -d);
      }
    };

    loop();
    return () => {
      active = false;
    };
  }, [inView, direction, controls]);

  /* ============================================
     MOTION VARIANTS
  ============================================ */
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  /* ============================================
     RENDER
  ============================================ */
  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="overflow-hidden py-6"
    >
      {/* Red line */}
      <div className="w-full h-[3px] bg-red-500"></div>

      {/* Title */}
      <motion.h2
        variants={fadeUp}
        className="text-xl font-bold mb-4 mt-8 tracking-widest text-white"
      >
        Breaking News
      </motion.h2>

      {/* Carousel */}
      <motion.div
        className="flex space-x-4 w-max select-none"
        animate={controls}
        style={{ willChange: "transform" }}
      >
        {[...cachedImages, ...cachedImages].map((src, i) => (
          <motion.img
            key={i}
            src={src}
            loading="lazy"
            alt={`breaking-news-${i}`}
            className="
              h-72 w-72 rounded-md object-cover shadow-lg 
              flex-shrink-0
            "
            variants={fadeUp}
            draggable={false}
          />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={fadeUp}
        className="text-[#A3A1A1] text-sm italic leading-relaxed mt-5 text-justify tracking-wide"
        dangerouslySetInnerHTML={{
          __html: data.breaking_news_content,
        }}
      />
    </motion.div>
  );
}
