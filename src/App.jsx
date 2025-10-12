import { useEffect, useState } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    // fix viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }

    const goFull = async () => {
      const el = document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
        setIsFullscreen(true);
      } catch {}
    };

    // auto fullscreen saat user tap pertama kali di mana pun
    const enable = () => {
      goFull();
      document.removeEventListener('click', enable);
      document.removeEventListener('touchstart', enable);
    };

    document.addEventListener('click', enable);
    document.addEventListener('touchstart', enable);

    return () => {
      document.removeEventListener('click', enable);
      document.removeEventListener('touchstart', enable);
    };
  }, []);

  const playPopSound = () => {
    const audio = new Audio('/audio/pop.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const handleEnter = () => {
    playPopSound();
    setFadeIn(true);
    setTimeout(() => setIsLogin(true), 300);
  };

  return (
    <div
      className={`min-h-screen w-full bg-black text-white flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        isFullscreen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`w-full transition-opacity duration-1000 ease-out ${
          fadeIn ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {isLogin ? (
          <div
            className="animate-fadein"
            style={{ animation: 'fadein 1s ease-in forwards' }}
          >
            <Thumbnail />
          </div>
        ) : (
          <UserWatch onClick={handleEnter} />
        )}
      </div>
    </div>
  );
}

export default App;
