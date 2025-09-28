import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import data from "../../../data/config.json";

export default function BreakingNews() {
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [direction, setDirection] = useState("right");
  const [inView, setInView] = useState(false);

  const images = data.breaking_news_img || [];

  // Auto scroll ping-pong
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 1; // pixel per frame
    let animationId;

    const scrollPingPong = () => {
      if (!el) return;

      if (direction === "right") {
        el.scrollLeft += speed;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          setDirection("left");
        }
      } else {
        el.scrollLeft -= speed;
        if (el.scrollLeft <= 0) {
          setDirection("right");
        }
      }

      animationId = requestAnimationFrame(scrollPingPong);
    };

    scrollPingPong();

    return () => cancelAnimationFrame(animationId);
  }, [direction]);

  // Observer untuk trigger animasi ulang
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // masuk viewport → jalankan animasi lagi
            setInView(true);
          } else {
            // keluar viewport → reset jadi hidden
            setInView(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Variants animasi
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

  return (
    <motion.div
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <div className="w-full h-[3px] bg-red-500"></div>

      {/* Title */}
      <motion.h2
        variants={itemVariants}
        className="text-xl font-bold mb-4 mt-10 tracking-widest text-white"
      >
        Breaking News
      </motion.h2>

      {/* Carousel */}
      <motion.div
        variants={itemVariants}
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar space-x-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`breaking-news-${index}`}
            className="h-72 w-72 flex-shrink-0 rounded-md object-cover shadow-lg"
            variants={itemVariants}
          />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className="text-[#A3A1A1] text-sm italic leading-[1.15rem] mt-4"
        dangerouslySetInnerHTML={{
          __html: data.breaking_news_content,
        }}
      />
    </motion.div>
  );
}
