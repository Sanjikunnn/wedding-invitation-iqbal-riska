import React, { useEffect, useState } from 'react';
import DetailInfo from '../detail-info';
import data from '../../../data/config.json'; // Pastikan path ini benar

// --- Komponen Pembantu: TagItem ---
// Menggunakan React.memo untuk mencegah re-render jika props tidak berubah
const TagItem = React.memo(({ title }) => (
  <li className="bg-[#4D4D4D] py-1 px-2 rounded-xl text-xs text-white animate-fadeIn delay-700">
    {title}
  </li>
));

// --- Komponen Utama: Thumbnail ---
export default function Thumbnail() {
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  useEffect(() => {
    // Threshold scroll untuk memicu pembukaan detail.
    // Nilai 1 pixel sangat sensitif, disarankan nilai yang lebih besar
    // jika ingin perilaku yang kurang responsif terhadap sentuhan/gulir tak sengaja.
    const scrollThreshold = 1;

    // Fungsi handler untuk event scroll
    const handleScroll = () => {
      // Jika halaman digulir melebihi threshold, buka detail
      if (window.scrollY > scrollThreshold) {
        setIsOpenDetail(true);
      }
    };

    // Fungsi handler untuk event sentuhan (touchmove)
    const handleTouchMove = (event) => {
      const touch = event.touches[0];
      // Jika ada sentuhan dan posisi Y sentuhan kurang dari -scrollThreshold, buka detail
      // Perhatikan: Logika ini mungkin perlu penyesuaian jika ingin membedakan
      // geser ke atas vs. geser ke bawah secara lebih akurat.
      if (touch && touch.clientY < -scrollThreshold) {
        setIsOpenDetail(true);
      }
    };

    // Menambahkan event listeners untuk scroll dan touchmove
    // Menggunakan { passive: true } untuk performa scroll yang lebih baik pada mobile
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Fungsi cleanup: Hapus event listeners saat komponen di-unmount
    // Penting untuk mencegah memory leak dan perilaku yang tidak diinginkan.
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
    };
    // Array dependensi kosong berarti efek ini hanya berjalan sekali saat mount
    // dan membersihkan saat unmount.
  }, []); // Dependensi kosong, jadi efek berjalan hanya sekali saat mount

  // Jika isOpenDetail adalah true, render komponen DetailInfo dan hentikan render Thumbnail
  if (isOpenDetail) {
    return <DetailInfo />;
  }

  // Render komponen Thumbnail jika isOpenDetail masih false
  return (
    <div className="relative min-h-screen overflow-hidden animate-fadeCinematic">
      {/* Lapisan Overlay Hitam untuk membuat gambar latar belakang lebih gelap */}
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      {/* Gambar latar belakang dengan efek zoom masuk yang lembut */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-zoomSlow z-[-1]"
        style={{
          backgroundImage: `url(${data.thumbnail_image_url})`,
        }}
      />

      {/* Konten Utama yang diletakkan di bagian bawah layar */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen">
        <div className="pb-10 pt-2 bg-gradient-to-b from-transparent via-black/80 to-black px-5">
          <div className="mb-10 space-y-4">
            {/* Gambar pasangan pengantin, disesuaikan agar tidak memudar */}
            <img
              src="/images/iqbalriska.png" // Pastikan path gambar ini benar
              alt={`${data.pegantin.pria.panggilan} & ${data.pegantin.wanita.panggilan} Wedding Thumbnail`} // Teks alternatif yang lebih deskriptif
              loading="lazy" // Memuat gambar secara deferred untuk performa
              width={100} // Tetapkan lebar intrinsik
              height={100} // Tetapkan tinggi intrinsik (disarankan rasio aspek 1:1 atau sesuai gambar asli)
              className="mx-auto w-[100px] h-auto object-contain animate-fadeOut delay-300" // Gunakan fadeIn, bukan fadeOut
              // Class 'opacity-0 animate-fadeOut delay-300' asli akan membuat gambar tidak terlihat dan memudar
              // Kami menggantinya dengan 'animate-fadeIn delay-300' agar gambar muncul.
            />

            {/* Judul utama dengan nama pengantin */}
            <h1 className="font-bold text-3xl leading-snug text-white text-center animate-fadeIn delay-500">
              {data.pegantin.pria.panggilan} & {data.pegantin.wanita.panggilan}
              <br />
              <span className="text-lg font-light text-gray-300">A Love Story</span>
            </h1>

            {/* Informasi "Coming Soon" dan tanggal pernikahan */}
            <div className="flex gap-3 justify-center items-center text-white animate-fadeIn delay-700">
              <span className={`text-xs text-white rounded-md px-2 py-1 ${
                new Date() >= new Date(data.tanggal_pernikahan)
                  ? 'bg-green-600'
                  : 'bg-red-600'
              }`}>
                {new Date() >= new Date(data.tanggal_pernikahan)
                  ? 'Berlangsung'
                  : 'Coming Soon'}
              </span>
              <p className="text-sm">{data.tanggal_pernikahan}</p>
            </div>


            {/* Daftar tag terkait acara */}
            <ul className="flex gap-2 justify-center items-center text-xs" aria-label="Wedding Tags">
              <TagItem title="#Romance" />
              <TagItem title="#Wedding" />
              <TagItem title="#TheBride&Groom" />
              <TagItem title="#Love" />
              <TagItem title="#Story" />
            </ul>
          </div>

          {/* Bagian tombol "See The Detail" dan ikon panah */}
          <div className="w-full text-center">
            <button
              onClick={() => setIsOpenDetail(true)} // Fungsi onClick tetap sama
              className="uppercase w-full text-xs font-semibold text-zinc-400 animate-bounceIn"
              aria-label="See Wedding Details" // Label untuk aksesibilitas
            >
              Klik Disini untuk Melihat Undangan
            </button>
            <div className="rotate-180 animate-bounce mt-2" aria-hidden="true"> {/* Ikon panah dekoratif, disembunyikan dari screen reader */}
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