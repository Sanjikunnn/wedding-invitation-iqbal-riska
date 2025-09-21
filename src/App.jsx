import { useState } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA_AG8R0p53EhsKrNJb_6Bz8187aSPFwPk",
    authDomain: "wedding-invitation-iqbal-riska.firebaseapp.com",
    projectId: "wedding-invitation-iqbal-riska",
    storageBucket: "wedding-invitation-iqbal-riska.firebasestorage.app",
    messagingSenderId: "38246313379",
    appId: "1:38246313379:web:bbf720384e64c40d003e16",
    measurementId: "G-Y1402HSTQ6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return (
  <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
    <div className="w-full">
      {isLogin ? (
        <Thumbnail />
      ) : (
        <UserWatch
          onClick={() => {
            setIsLogin(true);
          }}
        />
      )}
    </div>
  </div>
);

}

export default App;
