import { useEffect, useState } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  // Paksa tampilan full zoom & fullscreen di HP
  useEffect(() => {
    // 1. Pastikan viewport scale = 1
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }

    // 2. Coba minta fullscreen (untuk mobile browser)
    const goFullScreen = () => {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    };

    // aktifkan fullscreen setelah user menyentuh layar (bukan otomatis)
    const enableFS = () => {
      goFullScreen();
      document.removeEventListener('click', enableFS);
    };
    document.addEventListener('click', enableFS);

    return () => document.removeEventListener('click', enableFS);
  }, []);

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

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
      <div className="w-full">
        {isLogin ? (
          <Thumbnail />
        ) : (
          <UserWatch onClick={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
