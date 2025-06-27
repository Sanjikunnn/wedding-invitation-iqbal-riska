import React from 'react';
import data from '../../../data/config.json';

export default function TitleInfo() {
  return (
    <div className="space-y-1 font-cursive text-white">
      <div className="flex gap-2 items-center">
        <img src="/favicon.ico" alt="logo" width={18} height={18} />
        <span className="text-[#A3A1A1] text-xs mt-0.5 tracking-widest">
         🎬The Wedding Premiere
        </span>
      </div>
      <h2 className="text-xl leading-5 text-white font-bold tracking-widest">
        {data.pegantin.pria.panggilan} &amp; {data.pegantin.wanita.panggilan} -
        A Love Story
      </h2>
      <div className="flex gap-1 items-center">
        <span className="text-green-500 mr-2">100% match</span>
        <span className="bg-[#4D4D4D] text-white text-xs px-1 py-0 mr-2 rounded-sm">
          SU
        </span>
        <span className="text-white mr-2 text-xs">
          {data.tanggal_pernikahan.split('-')[0]}
        </span>
        <span className="text-white mr-2">1h 26m</span>
        <span>
          <img src="/images/4k-icon.png" width={16} height={16} alt="4k" />
        </span>
        <span>
          <img src="/images/hd-icon.png" width={16} height={16} alt="hd" />
        </span>
      </div>
      <div
        className={`py-1 px-2 rounded text-xs text-white font-bold w-fit ${
          new Date() >= new Date(data.tanggal_pernikahan)
            ? 'bg-green-600'
            : 'bg-[#E50913]'
        }`}
      >
        {new Date() >= new Date(data.tanggal_pernikahan)
          ? `Now Streaming • ${data.tanggal_pernikahan}`
          : `Coming Soon on Thursday • ${data.tanggal_pernikahan}`}
      </div>

      <div className="pt-2">
        <p className="text-white text-sm leading-[1.15rem] mb-2">
          {data.intro}
        </p>
        <p className="text-[#A3A1A1] text-[10px] leading-[1rem]">
          "Segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat
          (kebesaran Allah)" (Q.S Az-Zariyah: 49)
        </p>
      </div>
    </div>
  );
}
