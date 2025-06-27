import React, { forwardRef, useEffect, useRef, useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import badwords from 'indonesian-badwords';

const WishItem = forwardRef(({ name, message, color }, ref) => (
  <div
    ref={ref}
    className="flex items-start gap-3 bg-white/5 rounded-lg p-3 backdrop-blur-sm shadow-md animate-popIn border border-white/10"
  >
    <div>
      <img
        width={32}
        height={32}
        src="images/face.png"
        style={{ backgroundColor: color }}
        className="rounded-full p-1"
      />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">{name}</p>
      <p className="text-sm text-white/80">{message}</p>
    </div>
  </div>
));

const colorList = ['red', '#ffdb58', '#6bc76b', '#48cae4'];

export default function WishSection() {
  const lastChildRef = useRef(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length < 3) return setError('Nama minimal 3 karakter!');
    if (message.length < 10) return setError('Pesan minimal 10 karakter!');
    if (badwords.flag(name)) return setError('Gabolah kata kasar!');

    setLoading(true);
    setError(null);

    const randomColor = colorList[data.length % colorList.length];
    const cleanMsg = badwords.censor(message);

    const { error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_NAME)
      .insert([{ name, message: cleanMsg, color: randomColor }]);

    setLoading(false);

    if (error) return setError(error.message);

    fetchData();
    setTimeout(scrollToLastChild, 300);
    setName('');
    setMessage('');
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_NAME)
      .select('name, message, color');
    if (!error) setData(data);
  };

  const scrollToLastChild = () => {
    lastChildRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-white font-cursive animate-fadeIn">
      <div className="w-full h-[3px] bg-red-500"></div>
      <h2 className="text-xl mt-10 font-bold text-left text-white mb-5 tracking-wide">
        Wish for the Couple
      </h2>

      <div className="max-h-[20rem] overflow-auto space-y-4 px-2 pb-2 scroll-smooth">
        {data.map((item, index) => (
          <WishItem
            key={index}
            name={item.name}
            message={item.message}
            color={item.color}
            ref={index === data.length - 1 ? lastChildRef : null}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 px-2">
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="space-y-2">
          <input
            placeholder="Nama Kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <textarea
            placeholder="Pesan dan Doa untuk Kedua Mempelai"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-md font-semibold tracking-wide transition duration-300 ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110'
          }`}
        >
          {loading ? 'Sending...' : 'Send Wish 💌'}
        </button>
      </form>
    </div>
  );
}
