import { useEffect, useState } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const firebaseConfig = {
    apiKey: "AIzaSyA_AG8R0p53EhsKrNJb_6Bz8187aSPFwPk",
    authDomain: "wedding-invitation-iqbal-riska.firebaseapp.com",
    projectId: "wedding-invitation-iqbal-riska",
    storageBucket: "wedding-invitation-iqbal-riska.firebasestorage.app",
    messagingSenderId: "38246313379",
    appId: "1:38246313379:web:bbf720384e64c40d003e16",
    measurementId: "G-Y1402HSTQ6"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // 🔊 Efek suara kecil pas tombol ditekan
  const playPopSound = () => {
    const audio = new Audio('/audio/pop.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // 🖱️ Saat user klik tombol “Buka Undangan”
  const handleEnter = () => {
    playPopSound();

    // Langsung coba fullscreen TANPA async (wajib di event handler langsung)
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch (err) {
      console.warn('Fullscreen gagal:', err);
    }

    // 🎬 Masuk ke halaman utama (Thumbnail)
    setTimeout(() => setIsLogin(true), 150);
  };

  return (
    <div
      className={`min-h-screen w-full bg-black text-white flex items-center justify-center transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {isLogin ? <Thumbnail /> : <UserWatch onClick={handleEnter} />}
    </div>
  );
}

export default App;
