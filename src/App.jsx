import { useState } from 'react';
import './App.css';
import UserWatch from './components/section/user-watch';
import Thumbnail from './components/section/thumbnail';
function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-sm container">
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
