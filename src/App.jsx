import { useState, useEffect } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLogin(true), 2000); // auto masuk setelah 2 detik
    return () => clearTimeout(timer);
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
          <UserWatch />
        )}
      </div>
    </div>
  );
}

export default App;
