import React, { forwardRef, useEffect, useRef, useState } from 'react';
import supabase from '../../../lib/supabaseClient';
import badwords from 'indonesian-badwords';

const RSVPItem = forwardRef(({ name, status, total, color }, ref) => (
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
        alt="avatar"
      />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">{name}</p>
      <p className="text-sm text-white/80">
        {status === 'hadir' ? 'Akan hadir' : 'Tidak bisa hadir'} – {total} orang
      </p>
    </div>
  </div>
));

const colorList = ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2'];

export default function RSVPSection() {
  const lastChildRef = useRef(null);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('hadir');
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length < 3) return setError('Nama minimal 3 karakter!');
    if (badwords.flag(name)) return setError('Nama mengandung kata tidak pantas!');

    setLoading(true);
    setError(null);

    const randomColor = colorList[data.length % colorList.length];

    const { error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_RSVP) // contoh: RSVP table
      .insert([{ name, status, total: parseInt(total), color: randomColor }]);

    setLoading(false);

    if (error) return setError(error.message);

    fetchData();
    setTimeout(scrollToLastChild, 300);
    setName('');
    setTotal(1);
    setStatus('hadir');
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from(import.meta.env.VITE_APP_TABLE_RSVP)
      .select('name, status, total, color');
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
      <h2 className="text-xl mt-10 font-bold text-left text-white mb-5 tracking-wide">
        RSVP Kehadiran
      </h2>

      <div className="max-h-[20rem] overflow-auto space-y-4 px-2 pb-2 scroll-smooth">
        {data.map((item, index) => (
          <RSVPItem
            key={index}
            name={item.name}
            status={item.status}
            total={item.total}
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-black focus:outline-none"
          >
            <option value="hadir">Saya akan hadir</option>
            <option value="tidak_hadir">Maaf, saya tidak bisa hadir</option>
          </select>
        </div>

        <div className="space-y-2">
          <input
            type="number"
            min={1}
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Jumlah orang"
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
          {loading ? 'Mengirim...' : 'Kirim RSVP 🎉'}
        </button>
      </form>
    </div>
  );
}
