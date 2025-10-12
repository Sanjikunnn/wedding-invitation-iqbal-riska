import React, { useEffect, useState, useRef } from "react";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import data from "../../../data/config.json";

const IMAGE_INTERVAL = 3000;

export default function Bridegroom() {
  const wanitaImages =
    data.pegantin.wanita.foto_list || [data.pegantin.wanita.foto];
  const priaImages =
    data.pegantin.pria.foto_list || [data.pegantin.pria.foto];

  const [wanitaIndex, setWanitaIndex] = useState(0);
  const [priaIndex, setPriaIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Preload gambar berikutnya agar transisi lancar
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    preloadImage(wanitaImages[(wanitaIndex + 1) % wanitaImages.length]);
    preloadImage(priaImages[(priaIndex + 1) % priaImages.length]);
  }, [wanitaIndex, priaIndex, wanitaImages, priaImages]);

  // Ganti index setiap interval
  useEffect(() => {
    const interval = setInterval(() => {
      setWanitaIndex((prev) => (prev + 1) % wanitaImages.length);
      setPriaIndex((prev) => (prev + 1) % priaImages.length);
    }, IMAGE_INTERVAL);

    return () => clearInterval(interval);
  }, [wanitaImages.length, priaImages.length]);

  // Intersection observer → reset animasi tiap kali masuk viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          } else {
            setInView(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Variants animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const fromLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const fromRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <div className="w-full h-[3px] bg-red-500"></div>

      <motion.h2
        variants={fadeUp}
        className="text-xl leading-5 text-white font-bold mb-4 mt-10 tracking-widest"
      >
        Bride and Groom
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 font-cursive text-white"
      >
        {/* Pria masuk dari kiri */}
        <motion.div
          variants={fromLeft}
          className="flex flex-col items-center text-center"
        >
          <div className="relative w-full h-96 overflow-hidden rounded-md border border-white/10">
            {priaImages.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                loading="lazy"
                alt={`Foto ${idx + 1}`}
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{
                  opacity: idx === priaIndex ? 1 : 0,
                  scale: idx === priaIndex ? 1 : 1.05,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover rounded-md will-change-transform"
              />
            ))}
          </div>

          <div className="mt-3">
            <h4 className="text-lg text-white font-medium">
              {data.pegantin.pria.nama}
            </h4>
            {data.pegantin.pria.ig && (
              <a
                href={data.pegantin.pria.ig}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 text-xs mt-1 hover:text-blue-300 transition"
              >
                <FaInstagram className="mr-1" />{" "}
                {data.pegantin.pria.ig.replace("https://instagram.com/", "@")}
              </a>
            )}
            <p className="text-[#A3A1A1] text-xs leading-4 mt-1">
              Putra Pertama dari Bapak {data.pegantin.pria.bapak} &amp; Ibu{" "}
              {data.pegantin.pria.ibu}
            </p>
          </div>
        </motion.div>

        {/* Wanita masuk dari kanan */}
        <motion.div
          variants={fromRight}
          className="flex flex-col items-center text-center"
        >
          <div className="relative w-full h-96 overflow-hidden rounded-md border border-white/10">
            {wanitaImages.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                loading="lazy"
                alt={`Foto ${idx + 1}`}
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{
                  opacity: idx === wanitaIndex ? 1 : 0,
                  scale: idx === wanitaIndex ? 1 : 1.05,
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover rounded-md will-change-transform"
              />
            ))}
          </div>

          <div className="mt-3">
            <h4 className="text-lg text-white font-medium">
              {data.pegantin.wanita.nama}
            </h4>
            {data.pegantin.wanita.ig && (
              <a
                href={data.pegantin.wanita.ig}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-pink-400 text-xs mt-1 hover:text-pink-300 transition"
              >
                <FaInstagram className="mr-1" />{" "}
                {data.pegantin.wanita.ig.replace("https://instagram.com/", "@")}
              </a>
            )}
            <p className="text-[#A3A1A1] text-xs leading-4 mt-1 mb-6">
              Putri Pertama dari Bapak {data.pegantin.wanita.bapak} &amp; Ibu{" "}
              {data.pegantin.wanita.ibu}
            </p>
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
