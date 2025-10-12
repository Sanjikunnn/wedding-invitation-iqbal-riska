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
    // fade-in effect pas PWA dibuka
    setFadeIn(true);
  }, []);

  const playPopSound = () => {
    const audio = new Audio('/audio/pop.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const handleEnter = () => {
    playPopSound();
    setIsLogin(true);
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
