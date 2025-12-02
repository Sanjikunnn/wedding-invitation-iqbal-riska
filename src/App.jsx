import { useEffect, useState } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Analytics } from "@vercel/analytics/react"
function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // 🔥 Firebase Config
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

  /* =======================================
     🔄 CEK MODE PWA vs WEB BIASA
  ======================================= */
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    // Kalau mode PWA → auto fullscreen & langsung masuk
    if (isStandalone) {
      try {
        const el = document.body;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } catch (err) {
        console.warn("Auto fullscreen gagal:", err);
      }

      setTimeout(() => setIsLogin(true), 500); // auto masuk setelah fullscreen
    }
  }, []);

  // 🔊 Efek suara kecil pas tombol ditekan
  const playPopSound = () => {
    const audio = new Audio('/audio/pop.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  /* =======================================
     🖱️ USER KLIK “BUKA UNDANGAN”
  ======================================= */
  const handleEnter = () => {
    playPopSound();

    // Minta fullscreen manual (web mode)
    const el = document.body;
    try {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch (err) {
      console.warn('Fullscreen gagal:', err);
    }

    setTimeout(() => setIsLogin(true), 300);
  };

  return (
    <>
      <div
        className={`min-h-screen w-full bg-black text-white flex items-center justify-center transition-opacity duration-1000 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isLogin ? <Thumbnail /> : <UserWatch onClick={handleEnter} />}
      </div>

      {/* Vercel Analytics */}
      <Analytics />
    </>
  );

}

export default App;
