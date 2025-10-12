import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import data from "../../../data/config.json";

export default function BreakingNews() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = ke kanan, -1 = ke kiri
  const controls = useAnimation();

  const images = data.breaking_news_img || [];

  /* ===========================
     Intersection Observer
  ============================ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ===========================
     Ping-Pong Animation
  ============================ */
  useEffect(() => {
    if (!inView) {
      controls.stop();
      return;
    }

    const animatePingPong = async () => {
      while (true) {
        // Geser kanan
        await controls.start({
          x: direction > 0 ? "-50%" : "0%",
          transition: { duration: 40, ease: "linear" },
        });
        // Balik arah
        setDirection((prev) => -prev);
      }
    };

    animatePingPong();
  }, [inView, direction, controls]);

  /* ===========================
     Variants
  ============================ */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  /* ===========================
     Render
  ============================ */
  return (
    <motion.div
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="overflow-hidden"
    >
      <div className="w-full h-[3px] bg-red-500"></div>

      {/* Title */}
      <motion.h2
        variants={itemVariants}
        className="text-xl font-bold mb-4 mt-10 tracking-widest text-white"
      >
        Breaking News
      </motion.h2>

      {/* Carousel (infinite ping-pong) */}
      <motion.div
        className="flex space-x-4 w-max"
        animate={controls}
        style={{ willChange: "transform" }}
      >
        {[...images, ...images].map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`breaking-news-${i}`}
            className="h-72 w-72 flex-shrink-0 rounded-md object-cover shadow-lg"
            variants={itemVariants}
          />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className="text-[#A3A1A1] text-sm italic leading-[1.15rem] mt-4 text-justify tracking-wide"
        dangerouslySetInnerHTML={{
          __html: data.breaking_news_content,
        }}
      />
    </motion.div>
  );
}
