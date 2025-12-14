import React from "react";
import { motion } from "framer-motion";
import data from "../../../data/config.json";

export default function TitleInfo() {
  return (
    <div className="space-y-1 font-cursive text-white">
      {/* Logo + Premiere */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        viewport={{ once: false }} 
        className="flex gap-2 items-center"
      >
        <img src="/favicon.ico" alt="logo" width={18} height={18} />
        <span className="text-[#A3A1A1] text-xs mt-0.5 tracking-widest">
          🎬The Wedding Premiere
        </span>
      </motion.div>

      {/* Judul */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        viewport={{ once: false }}
        className="text-xl leading-5 text-white font-bold tracking-widest"
      >
        {data.pegantin.pria.panggilan} &amp; {data.pegantin.wanita.panggilan} - A Love Story
      </motion.h2>

      {/* Info bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        viewport={{ once: false }}
        className="flex gap-1 items-center"
      >
        <span className="text-green-500 mr-2">100% match</span>
        <span className="bg-[#4D4D4D] text-white text-xs px-1 py-0 mr-2 rounded-sm">SU</span>
        <span className="text-white mr-2 text-xs">
          {data.tanggal_pernikahan.split("-")[0]}
        </span>
        <span className="text-white mr-2">1h 26m</span>
        <span>
          <img src="/images/4k-icon.png" width={16} height={16} alt="4k" />
        </span>
        <span>
          <img src="/images/hd-icon.png" width={16} height={16} alt="hd" />
        </span>
      </motion.div>

      {/* Streaming badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        viewport={{ once: false }}
        className={`py-1 px-2 rounded text-xs text-white font-bold w-fit`}
      >
        {new Date() >= new Date(data.tanggal_pernikahan)
          ? `Now Streaming • ${data.tanggal_pernikahan}`
          : `Coming Soon on Thursday • ${data.tanggal_pernikahan}`}
      </motion.div>

      {/* Intro + Quote */}
      <div className="pt-2">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          viewport={{ once: false }}
          className="text-white text-sm leading-[1rem] mb-1 text-justify"
          dangerouslySetInnerHTML={{ __html: data.intro }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.7 }}
          viewport={{ once: false }}
          className="text-[#A3A1A1] text-[10px] leading-[1rem] italic text-center mt-1"
        >
          "Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat
          (kebesaran Allah)"
          <br /> (Q.S. Az-Zariyat: 49)
        </motion.p>
      </div>
    </div>
  );
}
