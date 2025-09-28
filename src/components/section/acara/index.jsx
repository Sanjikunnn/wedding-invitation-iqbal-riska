import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../../data/config.json";

export default function WeddingEventDetailsWithMap() {
  const akad = data.akad || {};
  const resepsi = data.resepsi || {};
  const makan = data.makan || {};
  const hasEmbed = data.maps && typeof data.maps === "string";
  const hasUrl = data.url_maps && typeof data.url_maps === "string";

  const [activeTab, setActiveTab] = useState("akad");
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer → refresh animasi setiap kali masuk viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true); // trigger animasi
          } else {
            setInView(false); // reset agar bisa diulang lagi
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Variants animasi konten tab
  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-black font-cursive text-white relative overflow-hidden"
    >
      {/* Judul */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0 }}
        className="relative z-10 mb-4 text-center"
      >
        <div className="w-full h-[3px] bg-red-500"></div>
        <h2 className="text-xl leading-5 text-white font-bold mb-10 mt-10 tracking-widest text-left">
          Detail Acara
        </h2>
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-1 text-sm text-gray-300 italic text-center"
        >
          📆 Upcoming Episodes: Wedding Schedule
        </motion.p>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative z-10 flex justify-center mb-6 gap-4 md:gap-8 overflow-x-auto no-scrollbar"
      >
        {[
          { key: "akad", label: "Akad Nikah" },
          { key: "resepsi", label: "Resepsi" },
          { key: "makan", label: "Silaturahmi" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 text-base font-cursive rounded-full transition ${
              activeTab === tab.key
                ? "bg-red-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Detail Acara dengan animasi container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-10 max-w-2xl mx-auto min-h-[200px]"
      >
        <AnimatePresence mode="wait">
          {activeTab === "akad" && (
            <motion.div
              key="akad"
              variants={contentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="border border-red-800 rounded-2xl shadow-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-red-600 mb-2 uppercase">
                Akad Nikah
              </h3>
              <p className="text-gray-300">
                <strong>Tanggal:</strong> {akad.tanggal || "---"}
                <br />
                <strong>Waktu:</strong> {akad.waktu || "---"}
                <br />
                <strong>Tempat:</strong> {akad.tempat || "---"}
              </p>
            </motion.div>
          )}

          {activeTab === "resepsi" && (
            <motion.div
              key="resepsi"
              variants={contentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="border border-red-800 rounded-2xl shadow-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-red-600 mb-2 uppercase">
                Resepsi
              </h3>
              <p className="text-gray-300">
                <strong>Tanggal:</strong> {resepsi.tanggal || "---"}
                <br />
                <strong>Waktu:</strong> {resepsi.waktu || "---"}
                <br />
                <strong>Tempat:</strong> {resepsi.tempat || "---"}
              </p>
            </motion.div>
          )}

          {activeTab === "makan" && (
            <motion.div
              key="makan"
              variants={contentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="border border-red-800 rounded-2xl shadow-lg p-6 text-center"
            >
              <h3 className="text-xl font-bold text-red-600 mb-2 uppercase">
                Silaturahmi Teman & Rekan Kerja
              </h3>
              <p className="text-gray-300">
                <em className="text-sm text-gray-400">
                  Acara santai bersama teman & rekan kerja 🤝🍽️
                </em>
                <br />
                <strong>Tanggal:</strong> {makan.tanggal || "---"}
                <br />
                <strong>Waktu:</strong> {makan.waktu || "---"}
                <br />
                <strong>Tempat:</strong> {makan.tempat || "---"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>


      {/* Map Section */}
      {hasEmbed && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <div className="text-center mb-4 font-cursive space-y-2">
            <p className="mt-1 text-sm text-gray-300 italic">
              🗺️ The Venue: Where the Story Unfolds
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border-4 border-red-800 bg-white/5 shadow-[0_0_30px_rgba(255,0,0,0.3)] transition-transform hover:scale-[1.01] duration-500">
            <iframe
              src={data.maps}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Wedding Location"
              aria-label="Google Maps of Wedding Location"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[400px] md:h-[600px] rounded-2xl"
            />
          </div>

          {hasUrl && (
            <div className="mt-6 text-center">
              <a
                href={data.url_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open in Google Maps
              </a>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
