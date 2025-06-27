import React, { useEffect, useRef, useState } from 'react';
import data from '../../../data/config.json';

export default function BreakingNews() {
  const scrollRef = useRef(null);
  const [direction, setDirection] = useState('right');

  const images = data.breaking_news_img || [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 1; // pixel per frame
    let animationId;

    const scrollPingPong = () => {
      if (!el) return;

      if (direction === 'right') {
        el.scrollLeft += speed;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          setDirection('left');
        }
      } else {
        el.scrollLeft -= speed;
        if (el.scrollLeft <= 0) {
          setDirection('right');
        }
      }

      animationId = requestAnimationFrame(scrollPingPong);
    };

    scrollPingPong();

    return () => cancelAnimationFrame(animationId);
  }, [direction]);

  return (
    <div>
      <div className="w-full h-[3px] bg-red-500"></div>
      <h2 className="text-xl font-bold mb-4 mt-10 tracking-widest text-white">
        Breaking News
      </h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll no-scrollbar space-x-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`breaking-news-${index}`}
            className="h-48 w-72 flex-shrink-0 rounded-md object-cover shadow-lg"
          />
        ))}
      </div>

      <div className="text-[#A3A1A1] text-sm italic leading-[1.15rem] mt-4">
        <div
          className="space-y-2"
          dangerouslySetInnerHTML={{
            __html: data.breaking_news_content,
          }}
        />
      </div>
    </div>
  );
}
