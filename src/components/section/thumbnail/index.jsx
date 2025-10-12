import React, { useEffect, useState } from "react";
import DetailInfo from "../detail-info";
import data from "../../../data/config.json"; // pastikan path benar

/* =========================
   Komponen Pembantu: TagItem
   ========================= */
const TagItem = React.memo(({ title, delay }) => (
  <span
    className="bg-[#4D4D4D] py-1 px-2 rounded-xl text-xs text-white opacity-0 animate-fadeInUp"
    style={{ animationDelay: delay, animationDuration: "1.2s" }}
  >
    {title}
  </span>
));

/* =========================
   Komponen Utama: Thumbnail
   ========================= */
export default function Thumbnail() {
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  useEffect(() => {
    const scrollThreshold = 1;

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) setIsOpenDetail(true);
    };

    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      if (touch && touch.clientY < -scrollThreshold) setIsOpenDetail(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  if (isOpenDetail) return <DetailInfo />;

  return (
    <div className="relative w-screen min-h-screen overflow-hidden animate-fadeCinematic">
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-zoomSlow z-[-1]"
        style={{
          backgroundImage: `url(${data.thumbnail_image_url})`,
        }}
      />

      {/* Konten Utama */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen">
        <div className="pb-10 pt-2 bg-gradient-to-b from-transparent via-black/80 to-black px-0">
          <div className="mb-10 space-y-2">
            {/* Gambar pasangan */}
            <img
              src="/images/iqbalriska.png"
              alt={`${data.pegantin.pria.panggilan} & ${data.pegantin.wanita.panggilan} Wedding Thumbnail`}
              className="mx-auto w-[100px] h-auto object-contain animate-fadeOutDown"
              style={{ animationDelay: "0.5s", animationDuration: "10s" }}
            />

            {/* Judul */}
            <h1
              className="font-bold text-3xl text-white text-center opacity-0 animate-fadeInUp"
              style={{ animationDelay: "1.2s", animationDuration: "1.5s" }}
            >
              {data.pegantin.pria.panggilan} & {data.pegantin.wanita.panggilan}
              <br />
              <span className="text-lg font-light text-gray-300">
                A Love Story
              </span>
            </h1>

            {/* Status + Tanggal */}
            <div
              className="flex gap-3 justify-center items-center text-white opacity-0 animate-fadeIn"
              style={{ animationDelay: "2s", animationDuration: "1.5s" }}
            >
              <span
                className={`text-xs text-white rounded-md px-2 py-1 ${
                  new Date() >= new Date(data.tanggal_pernikahan)
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {new Date() >= new Date(data.tanggal_pernikahan)
                  ? "Berlangsung"
                  : "Coming Soon"}
              </span>
              <p className="text-sm">{data.tanggal_pernikahan}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 justify-center items-center text-xs">
              <TagItem title="#Romance" delay="2.8s" />
              <TagItem title="#Wedding" delay="3.4s" />
              <TagItem title="#TheBride&Groom" delay="4s" />
              <TagItem title="#Love" delay="4.6s" />
              <TagItem title="#Story" delay="5.2s" />
            </div>
          </div>

          {/* Tombol terakhir */}
          <div
            className="w-full text-center opacity-0 animate-fadeInUp"
            style={{ animationDelay: "6s", animationDuration: "1.5s" }}
          >
            <button
              onClick={() => setIsOpenDetail(true)}
              className="uppercase w-full text-xs font-semibold text-zinc-400"
            >
              Klik Disini untuk Melihat Undangan
            </button>
            <div className="rotate-180 animate-bounce mt-2">
              <svg
                className="w-6 h-6 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 8"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
