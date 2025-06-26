import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Heart, Sparkles, Play, Crown, Star, Diamond, Gift } from 'lucide-react';
import data from '../../../data/config.json'; // Pastikan path ini benar

// --- Komponen Pembantu: Countdown Timer ---
const Countdown = ({ targetDate }) => {
  
  // Menggunakan useCallback untuk memoize fungsi agar tidak dibuat ulang setiap render
  const calculateTimeLeft = useCallback((target) => {
    const now = new Date();
    const targetMs = new Date(target); // Pastikan target adalah objek Date yang valid
    const diff = targetMs - now;
    
    if (diff < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds, isPast: false };
  }, []); // Dependensi kosong karena targetDate berasal dari useMemo di parent
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, calculateTimeLeft]);

  const boxClass = "flex flex-col items-center bg-black/70 border border-red-600 shadow-[0_0_10px_#dc2626aa] rounded-lg w-[50px] p-1";

  // Hindari menampilkan hitungan mundur jika sudah lewat
  if (timeLeft.isPast) {
    return (
      <div className="flex justify-center text-red-900 text-xl text-center md:text-xl font-cursive font-semibold uppercase bg-white/15 backdrop-blur px-1 py-0 rounded-xl shadow-inner">
        <p className="animate-pulse">Acara Telah Berlangsung!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 text-white font-bold text-sm md:text-lg font-mono bg-white/5 backdrop-blur px-1 py-1 rounded-xl border border-white/10 shadow-inner">
      <div className={boxClass}>
        <span className="text-yellow-500 text-xl md:text-xl animate-pulse">{timeLeft.days}</span>
        <span className="text-[10px] md:text-xs tracking-widest -mt-2">Hari</span>
      </div>
      <div className={boxClass}>
        <span className="text-yellow-500 text-xl md:text-xl animate-pulse">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-[10px] md:text-xs tracking-widest -mt-2">Jam</span>
      </div>
      <div className={boxClass}>
        <span className="text-yellow-500 text-xl md:text-xl animate-pulse">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-[10px] md:text-xs tracking-widest -mt-2">Menit</span>
      </div>
      <div className={boxClass}>
        <span className="text-yellow-500 text-xl md:text-xl animate-pulse">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-[10px] md:text-xs tracking-widest -mt-2">Detik</span>
      </div>
    </div>
  );
};

// --- Komponen Utama: UserWatch ---
export default function UserWatch({ onClick }) {
  const [to, setTo] = useState('Guest');
  const [started, setStarted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  // States ini lebih baik dihitung ulang saat diperlukan, atau jika memang ada perubahan dinamis.
  // Untuk partikel statis, inisialisasi di luar useEffect atau bahkan di luar komponen jika benar-benar statis.
  const [particles, setParticles] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);
  // const [currentTime, setCurrentTime] = useState(new Date()); // Tidak digunakan secara langsung di JSX setelah perubahan countdown

  const audioRef = useRef(null);

  // Inisialisasi parameter URL dan partikel hanya sekali saat komponen pertama kali mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const toParam = url.searchParams.get('to');
    setTo(toParam || 'Guest');

    // Inisialisasi partikel dan hati mengambang
    // Ini bisa di-memoize jika Anda ingin menghindari re-render yang tidak perlu dari data array itu sendiri.
    setParticles(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      type: Math.random() > 0.7 ? 'heart' : 'star',
    })));

    setFloatingHearts(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      // Menggunakan nilai awal y yang lebih tinggi untuk efek melayang dari bawah
      y: 100 + Math.random() * 20, 
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 6,
      size: Math.random() * 20 + 15,
    })));

    // Timer currentTime tidak lagi diperlukan jika hanya digunakan untuk Countdown component
    // const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // return () => clearInterval(timer);
  }, []); // Array dependensi kosong, hanya berjalan sekali saat mount

  const handleStart = useCallback(async () => {
    setStarted(true);
    try {
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        await audioRef.current.play();
      }
    } catch (err) {
      console.warn('Audio autoplay blocked:', err.message);
      // Fallback atau notifikasi pengguna jika autoplay diblokir
    }
    // Durasi timeout disesuaikan dengan durasi animasi dan loading Anda
    setTimeout(() => setShowContent(true), 4200);
  }, []);

  const handleGuestClick = useCallback(() => {
    // Memberikan feedback haptic jika didukung browser
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    onClick?.(); // Memanggil prop onClick jika ada
  }, [onClick]);

  // Mengubah format tanggal dari config.json ke format Date yang dapat dipahami JavaScript
  const targetDate = useMemo(() => {
    const rawDate = data.tanggal_pernikahan;
    // Menggunakan regex untuk menangani berbagai format bulan bahasa Indonesia
    const monthMap = {
      JANUARI: 'January', FEBRUARI: 'February', MARET: 'March',
      APRIL: 'April', MEI: 'May', JUNI: 'June',
      JULI: 'July', AGUSTUS: 'August', SEPTEMBER: 'September',
      OKTOBER: 'October', NOVEMBER: 'November', DESEMBER: 'December'
    };
    // Mengganti nama bulan dalam bahasa Indonesia menjadi Inggris untuk Date.parse
    const formattedDateString = rawDate.replace(/(\d+)\s([A-Z]+)\s(\d+)/i, (_, d, m, y) => {
      return `${monthMap[m.toUpperCase()]} ${d}, ${y}`;
    });
    return new Date(Date.parse(formattedDateString));
  }, [data.tanggal_pernikahan]); // Tergantung pada tanggal_pernikahan dari data

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Audio Element */}
      <audio ref={audioRef} src={data.whoosh_url} preload="auto" />

      {/* Background Layers */}
      <div className="absolute inset-0 z-[-3]">
        {/* Background image layer with subtle animation */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 opacity-60"
          style={{
            backgroundImage: "url('images/home2.jpeg')",
            filter: 'brightness(0.8) saturate(1.2) contrast(1.1)',
            animation: 'gentleZoom 25s ease-in-out infinite alternate',
          }}
        />
        {/* Gradient and animated lines for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-800/30 to-indigo-900/50 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-pink-300/30 to-transparent animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-purple-300/30 to-transparent animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }} />
        </div>
      </div>

      {/* Particles and Floating Hearts - Lighter opacity for background */}
      <div className="absolute inset-0 pointer-events-none z-[-2]">
        {particles.map(p => (
          <div key={p.id} className="absolute animate-float" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}>
            {p.type === 'heart' ? (
              <Heart size={p.size * 3} className="text-pink-300/40 animate-pulse" style={{ animationDuration: '3s' }} />
            ) : (
              <Star size={p.size * 2} className="text-yellow-300/30 animate-spin" style={{ animationDuration: '8s' }} />
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        {floatingHearts.map(h => (
          <div key={h.id} className="absolute animate-floatUp" style={{ left: `${h.x}%`, bottom: `${h.y}%`, animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}>
            <Heart size={h.size} className="text-rose-400/20 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        {!started && (
          <div className="relative flex flex-col justify-center items-center min-h-screen text-center px-6 bg-black/80 backdrop-blur-md border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] overflow-hidden">
            {/* Background motif batik */}
            <div
              className="absolute inset-0 z-10 opacity-30 "
              style={{
                backgroundImage: "url('/images/bahan/bg.webp')",
                backgroundRepeat: 'repeat',
                backgroundSize: '400px',
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-zinc-900/80 to-red-900/90 z-0" />

            {/* Decorative Icons (Hearts, Crowns, Diamonds, Sparkles) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {[
                ...Array.from({ length: 15 }, (_, i) => ({
                  Icon: Heart,
                  pos: `top-[${Math.random() * 90}%] left-[${Math.random() * 90}%]`,
                  color: 'text-pink-300',
                  size: 24 + (i % 3) * 6,
                  delay: `${i * 0.2}s`
                })),
                ...Array.from({ length: 10 }, (_, i) => ({
                  Icon: Crown,
                  pos: `top-[${Math.random() * 90}%] ${i % 2 === 0 ? 'left' : 'right'}-[${Math.random() * 50}%]`,
                  color: 'text-yellow-300',
                  size: 26 + (i % 2) * 4,
                  delay: `${i * 0.3}s`
                })),
                ...Array.from({ length: 10 }, (_, i) => ({
                  Icon: Diamond,
                  pos: `bottom-[${Math.random() * 80}%] ${i % 2 === 0 ? 'left' : 'right'}-[${Math.random() * 40}%]`,
                  color: 'text-amber-200',
                  size: 24 + (i % 2) * 6,
                  delay: `${i * 0.3}s`
                })),
                ...Array.from({ length: 15 }, (_, i) => ({
                  Icon: Sparkles,
                  pos: `top-[${Math.random() * 95}%] ${i % 2 === 0 ? 'left' : 'right'}-[${Math.random() * 90}%]`,
                  color: 'text-blue-100',
                  size: 20 + (i % 3) * 4,
                  delay: `${i * 0.2}s`
                }))
              ].map(({ Icon, pos, color, size, delay }, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} ${color} opacity-30 animate-float-smooth will-change-transform`}
                  style={{
                    transform: `rotate(${Math.random() * 30 - 15}deg) scale(${0.8 + Math.random() * 0.4})`,
                    animationDuration: `${10 + Math.random() * 5}s`,
                    animationDelay: delay
                  }}
                >
                  <Icon size={size} />
                </div>
              ))}
            </div>

            {/* Frame Gunungan & Ornamen */}
            {/* Lebih baik menggunakan z-index yang lebih jelas untuk penumpukan */}
            <img src="/images/bahan/gunungan.webp" alt="Gunungan" className="absolute top-100 mt-10 left-1/2 -translate-x-1/2 w-50 md:w-40 z-0" />
            <img src="/images/bahan/bm.webp" alt="pic" className="absolute -bottom-5 animate-wave z-0" />
            <img src="/images/bahan/bg-1.webp" alt="pic" className="absolute top-5 left-1/2 -translate-x-1/2 w-100 md:w-100 -z-10" />
            <img src="/images/bahan/bm-2.webp" alt="pic" className="absolute -top-8 mt-24 left-1/2 -translate-x-1/2 w-100 md:w-100 -z-10" />
            <img src="/images/bahan/tm-1.webp" alt="pic" className="absolute -top-2 w-100 md:w-100 z-20 animate-float" />
            <img src="/images/bahan/bl-2.webp" alt="pic" className="absolute -top-8 left-0 w-28 md:w-28 z-10" />
            <img src="/images/bahan/tl.webp" alt="pic" className="absolute top-28 left-0 w-28 md:w-28 z-10" />
            <img src="/images/bahan/tl-2.webp" alt="pic" className="absolute top-50 left-0 animate-wave z-0" />
            <img src="/images/bahan/bl-1.webp" alt="pic" className="absolute top-60 mt-6 -left-28 animate-waveleft z-0" />
            <img src="/images/bahan/sinta.webp" alt="pic" className="absolute top-60 -left-28 animate-waveleft z-10" />
            <img src="/images/bahan/br-2.webp" alt="pic" className="absolute -top-8 right-0 w-28 md:w-28 z-10" />
            <img src="/images/bahan/tr.webp" alt="pic" className="absolute top-28 right-0 w-28 md:w-28 z-10" />
            <img src="/images/bahan/tr-2.webp" alt="pic" className="absolute top-50 right-0 animate-wave z-0" />
            <img src="/images/bahan/br-1.webp" alt="pic" className="absolute top-60 mt-6 -right-28 animate-waveright z-0" />
            <img src="/images/bahan/rama.webp" alt="pic" className="absolute top-60 mt-5 -right-28 animate-waveright z-10" />
            <img src="/images/bahan/bl-3.webp" alt="pic" className="absolute bottom-0 left-0 z-0 w-[200px] h-auto" />
            <img src="/images/bahan/bl-2.webp" alt="pic" className="absolute bottom-20 left-0 w-20 md:w-28 z-10" />
            <img src="/images/bahan/br-3.webp" alt="pic" className="absolute bottom-0 right-0 w-[200px] h-auto" />
            <img src="/images/bahan/br-2.webp" alt="pic" className="absolute bottom-20 right-0 w-20 md:w-28 z-10" />
                        
            {/* Tagline */}
            <div
              className="absolute left-1/2 top-10 -translate-x-1/2 z-20 animate-fadeInPulse"
              style={{ animationDelay: '1.6s' }}
            >
              <span className="inline-flex items-center px-1 py-0 bg-white/10 text-white text-zinc-300 font-cursive text-sm tracking-widest shadow-lg backdrop-blur border-2 border-red/60">
                Inspired by Netflix
                <img
                  src="favicon.ico"
                  alt="icon"
                  className="w-4 h-3 inline-block ml-1" // Menambahkan margin kiri kecil
                />
              </span>
            </div>

            {/* Main Title & Subtitle with fade and slide animation */}
            <div className="absolute left-1/2 top-[240px] -translate-x-1/2 z-20 flex flex-col items-center w-full pointer-events-none">
              <div className="flex items-center space-x-2 mb-2 animate-fadeInDown" style={{ animationDelay: '0.2s' }}>
                <h1
                  className="text-xs md:text-2xl font-bold text-white/90 px-4 py-1 rounded-lg text-center"
                  style={{
                    fontFamily: "cursive",
                    letterSpacing: '0.08em'
                  }}
                >
                  The Wedding of
                </h1>
              </div>

              {/* Nama Pengantin */}
              <div className="flex flex-col items-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center space-x-2 relative">
                  <span
                    className="px-2 py-2 rounded-xl text-yellow-500 text-3xl md:text-5xl font-extrabold text-center shadow"
                    style={{
                      fontFamily: "cursive",
                      letterSpacing: '0.01em',
                      lineHeight: '1.1'
                    }}
                  >
                    {data.pegantin.pria.panggilan}
                  </span>
                </div>

                <span className="block text-xl md:text-3xl font-bold text-white my-1 font-cursive">&amp;</span>

                <div className="flex items-center space-x-2 relative">
                  <span
                    className="py-2 rounded-xl text-yellow-500 text-3xl md:text-5xl font-extrabold text-center shadow"
                    style={{
                      fontFamily: "cursive",
                      letterSpacing: '0.01em',
                      lineHeight: '1.1'
                    }}
                  >
                    {data.pegantin.wanita.panggilan}
                  </span>
                </div>
              </div>

              {/* Countdown Hari H */}
              <div className="mt-14 text-center z-20 bg-gradient-to-b from-black/50 to-black/10 rounded-lg p-1 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
                <p className="text-xl md:text-sm text-yellow-500 font-cursive mb-1 tracking-widest">
                  Menuju Hari Bahagia
                </p>
                <Countdown targetDate={targetDate} />
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="group absolute left-1/2 top-[89%] -translate-x-1/2 -translate-y-1/2 
                flex items-center gap-1 px-2 py-1
                bg-gradient-to-r from-red-700 via-red-600 to-red-800 
                text-white text-sm font-cursive rounded-full shadow-2xl 
                transition-all duration-500 ease-in-out 
                animate-fadeIn z-20 overflow-hidden hover:brightness-110 hover:scale-[1.02]"
              style={{
                animationDelay: '0.6s',
              }}
            >
              <span className="relative flex items-center justify-center">
                <Play
                  size={16}
                  className="text-white drop-shadow transition-transform duration-700 group-hover:rotate-[360deg]"
                />
              </span>

              <span className="group-hover:tracking-wider transition-all duration-700 ease-in-out">
                Buka Undangan
              </span>

              <span className="relative flex items-center justify-center">
                <Sparkles
                  size={16}
                  className="text-white drop-shadow transition-transform duration-700 group-hover:rotate-[360deg]"
                />
              </span>
            </button>

            {/* Footer */}
            <div
              className="absolute bottom-1 w-full text-center text-[10px] text-zinc-500 tracking-widest z-10 font-cursive animate-fadeIn"
              style={{ animationDelay: '2s' }}
            >
              ©{new Date().getFullYear()} {data.pegantin.pria.panggilan} & {data.pegantin.wanita.panggilan}
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {started && !showContent && (
          <div className="flex flex-col justify-center items-center min-h-screen space-y-10 bg-gradient-to-b from-black via-zinc-900 to-black text-white font-sans overflow-hidden px-6 relative">
            {/* CINEMATIC OVERLAY */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black z-0" />

            {/* PARTICLE EFFECTS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-red-600 opacity-10 animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    animationDelay: `${Math.random()}s`,
                    filter: 'blur(1px)'
                  }}
                />
              ))}
            </div>

            {/* LIGHT PULSE CIRCLE */}
            <div className="absolute w-[600px] h-[600px] bg-red-900/10 rounded-full blur-3xl animate-ping z-0" />

            {/* LOADING SPINNER - NETFLIX STYLE */}
            <div className="relative z-10 animate-fadeCinematic">
              <div className="w-28 h-28 border-[3px] border-zinc-800 border-t-red-600 rounded-full animate-spin shadow-[0_0_15px_#ef4444]" />
              <div
                className="absolute inset-2 w-24 h-24 border-[3px] border-transparent border-t-red-500 rounded-full animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '1.8s' }}
              />
              <div
                className="absolute inset-4 w-20 h-20 border-[3px] border-transparent border-t-red-400 rounded-full animate-spin"
                style={{ animationDuration: '2.4s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Gift className="text-red-500 animate-pulse drop-shadow-xl" size={32} />
              </div>
            </div>

            {/* TEXT + EFFECTS */}
            <div className="text-center space-y-6 relative z-10">
              <p className="text-2xl text-zinc-300 font-light tracking-wider animate-fadeIn">
                Sedang menyiapkan <br /><span className="text-white font-cursive">undangan spesial</span><br /> untuk Anda...
              </p>

              {/* Bounce Dots */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-md animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              {/* SHIMMER BAR */}
              <div className="w-64 h-1 mx-auto rounded-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent relative overflow-hidden">
                <div className="absolute w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-red-500/80 to-transparent" />
              </div>

              {/* TAGLINE */}
              <p className="text-xs text-zinc-500 italic font-cursive animate-fadeIn" style={{ animationDelay: '1.5s' }}>
                “Selangkah lagi menuju momen tak terlupakan.”
              </p>
            </div>
          </div>
        )}

        {/* Main Content (after loading) */}
        {started && showContent && (
          <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-zinc-900 to-black text-white font-sans overflow-hidden px-6 pt-10 pb-15 flex flex-col items-center text-center">

            {/* BACKGROUND OVERLAY & NOISE TEXTURE */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black z-0" />
            <div className="absolute inset-0 z-0 pointer-events-none animate-fadeIn">
              <div className="w-full h-full bg-noise opacity-[0.035] mix-blend-soft-light" />
            </div>

            {/* ORNAMENT ICONS */}
            <div className="absolute top-10 left-10 opacity-20 animate-waveright z-10">
              <Sparkles className="text-red-600 drop-shadow-xl" size={28} />
            </div>
            <div className="absolute top-20 right-12 opacity-10 animate-wave z-10">
              <Heart className="text-pink-500 drop-shadow-lg" size={22} />
            </div>

            {/* MAIN TITLE */}
            <div className="relative z-10 animate-fadeCinematic space-y-1">
              <h1
                className="text-2xl md:text-2xl font-black uppercase text-transparent
                           drop-shadow-[0_2px_10px_rgba(239,68,68,0.6)]
                           bg-gradient-to-r from-red-500 via-yellow-500 to-red-700
                           bg-clip-text bg-[length:300%_100%] bg-right
                           animate-shimmerx"
              >
                <span className="text-white drop-shadow-none bg-none bg-transparent !text-2xl md:!text-2xl">🎬</span> Wedding Premiere
              </h1>

              <p
                className="text-xs md:text-sm uppercase tracking-[0.3em]
                           bg-gradient-to-r from-red-500 via-white to-red-500
                           bg-[length:200%_100%] bg-clip-text text-transparent
                           animate-shimmerx"
              >
                A Romantic Original Series
              </p>
            </div>

            {/* Main Image with effects */}
            <div className="mt-10 relative z-10 animate-zoomSlow w-[250px] md:w-[300px] rounded-xl 
                shadow-[0_0px_30px_rgba(255,0,0,0.4)] overflow-hidden border-[3px] border-red-600/40 
                bg-gradient-to-br from-red-500/20 via-transparent to-red-500/20 
                bg-[length:200%_100%] bg-left animate-shimmerx">
              <img
                src="images/iqbalriska.png"
                alt={`${data.pegantin.pria.panggilan} & ${data.pegantin.wanita.panggilan}`}
                className="w-full h-full object-cover animate-float hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
            </div>

            {/* NAMA PASANGAN */}
            <div className="mt-10 z-10 animate-popIn">
              <h2
                className="text-xl md:text-2xl font-bold tracking-wide text-transparent 
                           bg-gradient-to-r from-white via-yellow-500 to-white bg-clip-text 
                           animate-shimmerx bg-[length:200%_100%] bg-right"
              >
                {data.pegantin.pria.nama} <br />&<br /> {data.pegantin.wanita.nama}
              </h2>
              <p className="text-sm text-zinc-400 mt-2 animate-bounceIn">
                Streaming ini akan dimulai pada <br />
                <span className="font-bold text-white">{data.tanggal_pernikahan}</span> <br />
                hanya untuk Anda.
              </p>
            </div>

            {/* TOMBOL TAMU */}
            <div
              onClick={handleGuestClick}
              className="mt-6 group cursor-pointer relative z-10 animate-slideUp hover:scale-105 transition-all duration-700"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full overflow-hidden border-[3px] border-red-600 bg-white/10 backdrop-blur-xl shadow-xl relative">
                <img
                  src="images/guest-icon.png"
                  alt="VIP Guest"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-black/30 group-hover:opacity-100 transition-all duration-500" />
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-sm text-zinc-400 tracking-widest animate-fadeIn">Kepada Bapak/Ibu Yth:</p>
                <p
                  className="text-xl md:text-2xl uppercase font-semibold text-transparent 
                             group-hover:text-red-500 transition 
                             bg-gradient-to-r from-white via-yellow-500 to-white 
                             bg-clip-text bg-[length:200%_100%] bg-right 
                             animate-shimmerx"
                >
                  {to}
                </p>

                <p className="text-xs text-zinc-500 group-hover:text-white transition animate-fadeIn">
                  Klik untuk masuk ke undangan spesial
                </p>
              </div>
            </div>

            {/* GRADIENT LINE */}
            <div className="absolute bottom-[60px] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50 animate-pulse z-10" />

            {/* COPYRIGHT */}
            <div
              className="absolute bottom-1 w-full text-center text-[10px] text-zinc-500 tracking-widest z-10 animate-fadeIn"
              style={{ animationDelay: '2s' }}
            >
              ©{new Date().getFullYear()} {data.pegantin.pria.panggilan} & {data.pegantin.wanita.panggilan}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}