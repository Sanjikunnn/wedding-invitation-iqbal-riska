import React, { useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import data from '../../../data/config.json';

const IMAGE_INTERVAL = 3000;

export default function Bridegroom() {
  const wanitaImages = data.pegantin.wanita.foto_list || [data.pegantin.wanita.foto];
  const priaImages = data.pegantin.pria.foto_list || [data.pegantin.pria.foto];

  const [wanitaIndex, setWanitaIndex] = useState(0);
  const [priaIndex, setPriaIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWanitaIndex((prev) => (prev + 1) % wanitaImages.length);
      setPriaIndex((prev) => (prev + 1) % priaImages.length);
    }, IMAGE_INTERVAL);

    return () => clearInterval(interval);
  }, [wanitaImages.length, priaImages.length]);

  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>
      <h2 className="text-xl leading-5 text-white font-bold mb-4 mt-10 tracking-widest">Bride and Groom</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-cursive text-white">
        {/* Pria */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full h-48 overflow-hidden rounded-md">
            {priaImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Foto ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-1000 ${
                  idx === priaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
          </div>
          <div className="mt-3">
            <h4 className="text-lg text-white font-medium">{data.pegantin.pria.nama}</h4>
            {data.pegantin.pria.ig && (
              <a
                href={data.pegantin.pria.ig}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 text-xs mt-1 hover:text-blue-300 transition"
              >
                <FaInstagram className="mr-1" />{' '}
                {data.pegantin.pria.ig.replace('https://instagram.com/', '@')}
              </a>
            )}
            <p className="text-[#A3A1A1] text-xs leading-4 mt-1">
              Putra Pertama dari Bapak {data.pegantin.pria.bapak} &amp; Ibu {data.pegantin.pria.ibu}
            </p>
          </div>
        </div>

        {/* Wanita */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full h-48 overflow-hidden rounded-md">
            {wanitaImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Foto ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-1000 ${
                  idx === wanitaIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
          </div>
          <div className="mt-3">
            <h4 className="text-lg text-white font-medium">{data.pegantin.wanita.nama}</h4>
            {data.pegantin.wanita.ig && (
              <a
                href={data.pegantin.wanita.ig}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-pink-400 text-xs mt-1 hover:text-pink-300 transition"
              >
                <FaInstagram className="mr-1" />{' '}
                {data.pegantin.wanita.ig.replace('https://instagram.com/', '@')}
              </a>
            )}
            <p className="text-[#A3A1A1] text-xs leading-4 mt-1">
              Putri Pertama dari Bapak {data.pegantin.wanita.bapak} &amp; Ibu {data.pegantin.wanita.ibu}
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
}
