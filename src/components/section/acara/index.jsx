import React, { useState } from 'react';
import data from '../../../data/config.json';

export default function WeddingEventDetailsWithMap() {
  const akad = data.akad || {};
  const resepsi = data.resepsi || {};
  const hasEmbed = data.maps && typeof data.maps === 'string';
  const hasUrl = data.url_maps && typeof data.url_maps === 'string';

  const [activeTab, setActiveTab] = useState('akad');

  return (
    <section className="bg-black font-cursive text-white relative overflow-hidden">
      {/* Judul */}
      <div className="relative z-10 mb-4 text-center animate-fadeInUp">
        <h2 className="text-xl leading-5 text-white font-bold mb-10 mt-10 tracking-widest text-left ">Detail Acara</h2>
        
        <p className="mt-1 text-sm text-gray-300 italic">
              📆 Upcoming Episodes: Wedding Schedule
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="relative z-10 flex justify-center mb-6 gap-12 animate-fadeInUp">
        <button
          onClick={() => setActiveTab('akad')}
          className={`px-4 py-1 text-base font-cursive rounded-full transition ${
            activeTab === 'akad'
              ? 'bg-red-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Akad Nikah
        </button>
        <button
          onClick={() => setActiveTab('resepsi')}
          className={`px-4 py-1 text-base font-cursive rounded-full transition ${
            activeTab === 'resepsi'
              ? 'bg-red-600 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Resepsi
        </button>
      </div>

      {/* Detail Acara */}
      <div className="relative z-10 max-w-2xl mx-auto animate-fadeIn delay-700">
        {activeTab === 'akad' && (
          <div className="border border-red-800 rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-red-600 mb-2 uppercase ">Akad Nikah</h3>
            <p className="text-gray-300">
              <strong>Tanggal:</strong> {akad.tanggal || '---'}<br />
              <strong>Waktu:</strong> {akad.waktu || '---'}<br />
              <strong>Tempat:</strong> {akad.tempat || '---'}
            </p>
          </div>
        )}

        {activeTab === 'resepsi' && (
          <div className="border border-red-800 rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-red-600 mb-2 uppercase ">Resepsi</h3>
            <p className="text-gray-300">
              <strong>Tanggal:</strong> {resepsi.tanggal || '---'}<br />
              <strong>Waktu:</strong> {resepsi.waktu || '---'}<br />
              <strong>Tempat:</strong> {resepsi.tempat || '---'}
            </p>
          </div>
        )}
      </div>

      {/* Map Section */}
      {hasEmbed && (
        <div className="relative z-10 mt-6 max-w-6xl mx-auto animate-fadeInUp">
          <div className="text-center mb-4 font-cursive space-y-2">
            <p className="mt-1 text-sm text-gray-300 italic">
              🗺️ The Venue: Where the Story Unfolds
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border-4 border-red-800 bg-white/5 shadow-[0_0_30px_rgba(255,0,0,0.3)] transition-transform hover:scale-[1.01] duration-500">
            <iframe
              src={data.maps}
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Wedding Location"
              aria-label="Google Maps of Wedding Location"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[400px] md:h-[600px] rounded-2xl"
            />
          </div>

          {hasUrl && (
            <div className="mt-6 mb-4 text-center">
              <a
                href={data.url_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open in Google Maps
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
