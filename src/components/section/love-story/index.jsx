import React, { useEffect, useState } from 'react';
import data from '../../../data/config.json';

const IMAGE_INTERVAL = 3000;

const LoveItem = ({ imageList, title, duration, description }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % imageList.length);
    }, IMAGE_INTERVAL);
    return () => clearInterval(interval);
  }, [imageList.length]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div className="relative w-full h-[100px] rounded-md overflow-hidden">
          {imageList.map((img, idx) => (
            <img
              key={idx}
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
            <p className="text-white mb-2 tracking-tighter">{title}</p>
            {duration && <p className="text-xs text-[#A3A1A1]">{duration}</p>}
          </div>
        </div>
      </div>
      <p className="text-[#A3A1A1] text-xs mt-2">{description}</p>
    </div>
  );
};

export default function LoveStory() {
  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>
      <h2 className="text-xl tracking-widest leading-5 text-white font-bold font-cursive mb-4 mt-10">Our Love Story</h2>
      <div className="space-y-4">
        {data.love_story.map((item, index) => (
          <LoveItem
            key={index}
            title={item.title}
            imageList={item.image_list}
            duration={item.duration || ''}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
