import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // icon panah
import data from '../../../data/config.json';

const IMAGE_INTERVAL = 3000;

const LoveItem = ({ imageList, title, duration, description, tagline, cliffhanger, dialogs }) => {
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

  // Potong deskripsi kalau belum expand
  const shortDesc = description?.length > 120 ? description.slice(0, 120) + '...' : description;

  return (
    <div className="bg-black bg-opacity-30 p-3 rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        <div className="relative w-full h-[100px] md:h-[300px] rounded-md overflow-hidden">
          {imageList.map((img, idx) => (
            <img
              key={idx}
              loading="lazy"
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-md transition-opacity duration-1000 ${
                idx === imageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              src={img}
              alt={`Slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <div className="my-auto">
            <p className="text-white mb-1 tracking-tighter font-semibold">{title}</p>
            {duration && <p className="text-xs text-[#A3A1A1]">{duration}</p>}
            {tagline && <p className="text-xs italic text-gray-300 mt-1">"{tagline}"</p>}
          </div>
        </div>
      </div>

      {/* Deskripsi */}
      <p className="text-[#A3A1A1] text-xs mt-2">
        {expanded ? description : shortDesc}
      </p>

      {/* Dialog hanya tampil kalau expanded */}
      {expanded && dialogs && dialogs.length > 0 && (
        <div className="mt-4 space-y-3">
          {dialogs.map((dialog, idx) => (
            <div
              key={idx}
              className={`flex ${
                dialog.role === 'leader' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`relative px-2 py-1 max-w-[70%] text-xs shadow-md ${
                  dialog.role === 'leader'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl rounded-br-sm'
                    : 'bg-white/10 text-gray-200 rounded-2xl rounded-bl-sm'
                }`}
              >
                <p className="text-[10px] uppercase tracking-wide font-semibold opacity-70 mb-1">
                  {dialog.name}
                </p>
                <p className="leading-snug">{dialog.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Tombol expand */}
      {description?.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 text-xs mt-1 underline"
        >
          {expanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
        </button>
      )}

      {cliffhanger && <p className="text-red-400 text-xs mt-2 italic">— {cliffhanger}</p>}
    </div>
  );
};

export default function LoveStory() {
  const [currentPage, setCurrentPage] = useState(0);
  const episodes = data.love_story || [];
  const totalPages = episodes.length;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const currentEpisode = episodes[currentPage];

  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>
      <h2 className="text-xl tracking-widest leading-5 text-white font-bold font-cursive mb-4 mt-10">
        Our Love Story
      </h2>

      {/* Render hanya episode aktif */}
      {currentEpisode && (
        <LoveItem
          title={currentEpisode.title}
          imageList={currentEpisode.image_list}
          duration={currentEpisode.duration || ''}
          tagline={currentEpisode.tagline}
          description={currentEpisode.description}
          cliffhanger={currentEpisode.cliffhanger}
          dialogs={currentEpisode.dialogs}
        />
      )}

      {/* Pagination pakai ikon */}
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
                idx === currentPage ? 'bg-red-500 scale-110' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
