import React from 'react';
import data from '../../../data/config.json';

export default function WeddingMap() {
  const hasEmbed = data.maps && typeof data.maps === 'string';
  const hasUrl = data.url_maps && typeof data.url_maps === 'string';

  return (
    <section className="bg-black font-sans text-white relative overflow-hidden">
      {/* Background gradien ala Netflix */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-60 pointer-events-none z-0" />

      {/* Judul ala Netflix */}
      <div className="relative z-10 text-left mb-4 mt-10 animate-fadeInUp">
        <h2 className="text-lg leading-5 text-white font-bold">
          <span className="drop-shadow-md">Our Wedding Venue</span>
        </h2>
        <p className="mt-1 text-lg md:text-xl text-gray-300 italic">
          Where our story continues...
        </p>
      </div>

      {/* Map section */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {hasEmbed ? (
          <div className="overflow-hidden rounded-2xl border-4 border-red-700 shadow-[0_0_60px_rgba(255,0,0,0.5)] transition-transform hover:scale-[1.01] duration-500">
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
        ) : (
          <div className="bg-red-900/30 border border-red-800 rounded-xl  text-center shadow-xl max-w-2xl mx-auto animate-fadeIn">
            <h3 className="text-xl font-bold mb-3">Map Not Available</h3>
            <p className="text-sm text-gray-300">Please check back later or contact us directly.</p>
          </div>
        )}
      </div>

      {/* Tombol buka di Google Maps */}
      {hasUrl && (
        <div className="relative z-10 mt-8 mb-4 text-center animate-fadeInUp">
          <a
            href={data.url_maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-300"
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
    </section>
  );
}
