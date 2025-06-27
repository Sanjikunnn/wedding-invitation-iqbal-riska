import React from 'react';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4 px-6 py-10">
      <h1 className="text-2xl font-bold tracking-wide text-red-500 mb-6">🍿 Wedding Menu</h1>

      <MenuButton to="/breaking-news" label="Breaking News" />
      <MenuButton to="/wedding-event" label="Wedding Event" />
      <MenuButton to="/bride-groom" label="Bride & Groom" />
      <MenuButton to="/love-story" label="Love Story" />
      <MenuButton to="/gallery" label="Gallery" />
      <MenuButton to="/gift" label="Gift Section" />
      <MenuButton to="/wishes" label="Wishes" />
      <MenuButton to="/rsvp" label="RSVP" />
    </div>
  );
};

const MenuButton = ({ to, label }) => (
  <Link
    to={to}
    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full shadow-md transition duration-200 w-full max-w-xs text-center"
  >
    {label}
  </Link>
);

export default MenuPage;
