import React, { useEffect, useState } from 'react';
import TitleInfo from '../title-info';
import BreakingNews from '../breaking-news';
import Bridegroom from '../bride-groom';
import LoveStory from '../love-story';
import OurGallery from '../our-gallery';
import WishSection from '../wish';
import Footer from '../footer';
import data from '../../../data/config.json';
import SongButton from '../../ui/song-button';
import GiftSection from '../gift';
import WeddingEventDetailsWithMap from '../acara';
import RSVPSection from '../rsvp';

export default function DetailInfo() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -40% 0px' } // supaya aktif pas udah agak tengah layar
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="space-y-5 pb-10 scroll-smooth">
      {/* Video Opening */}
      <video className="w-full" autoPlay muted>
        <source src={data.url_video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 flex justify-around items-center py-2 z-50 text-white text-[10px] sm:text-xs">
        {data.show_menu.breaking_news && (
          <a
            href="#breaking-news"
            onClick={() => setActiveSection('breaking-news')}
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
              activeSection === 'breaking-news'
                ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
                : 'text-white'
            }`}
          >
            <span>📰</span>
            <span>News</span>
          </a>
        )}
        {data.show_menu.wedding_event && (
          <a
            href="#wedding-event"
            onClick={() => setActiveSection('wedding-event')}
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'wedding-event'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>💒</span>
            <span>Event</span>
          </a>
        )}
        {data.show_menu.bride_and_groom && (
          <a
            href="#bride-groom"
            onClick={() => setActiveSection('bride-groom')}
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'bride-groom'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>💑</span>
            <span>Couple</span>
          </a>
        )}
        {data.show_menu.love_story && (
          <a
            href="#love-story"
            onClick={() => setActiveSection('love-story')}  
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'love-story'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>❤️</span>
            <span>Story</span>
          </a>
        )}
        {data.show_menu.gallery && (
          <a
            href="#gallery"
            onClick={() => setActiveSection('gallery')}
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'gallery'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>📸</span>
            <span>Gallery</span>
          </a>
        )}
        {data.show_menu.GiftSection && (
          <a
            href="#gift"
            onClick={() => setActiveSection('gift')}  
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'gift'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>🎁</span>
            <span>Gift</span>
          </a>
        )}
        {data.show_menu.wish && import.meta.env.VITE_APP_TABLE_NAME && (
          <a
            href="#wishes"
            onClick={() => setActiveSection('wishes')}
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'wishes'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>💌</span>
            <span>Wishes</span>
          </a>
        )}
        {data.show_menu.rsvp && import.meta.env.VITE_APP_TABLE_RSVP && (
          <a
            href="#rsvp"
            onClick={() => setActiveSection('rsvp')}
            className={`flex flex-col items-center transition duration-300 ease-in-out ${
            activeSection === 'rsvp'
              ? 'text-red-500 scale-110 underline underline-offset-4 decoration-red-500'
              : 'text-white'
          }`}

          >
            <span>📝</span>
            <span>RSVP</span>
          </a>
        )}
      </div>

      {/* Konten Detail */}
      <div className="px-4 space-y-4">
        <TitleInfo />

        {data.show_menu.breaking_news && (
          <section id="breaking-news">
            <BreakingNews />
          </section>
        )}

        {data.show_menu.wedding_event && (
          <section id="wedding-event">
            <WeddingEventDetailsWithMap />
          </section>
        )}

        {data.show_menu.bride_and_groom && (
          <section id="bride-groom">
            <Bridegroom />
          </section>
        )}

        {data.show_menu.love_story && (
          <section id="love-story">
            <LoveStory />
          </section>
        )}

        {data.show_menu.gallery && (
          <section id="gallery">
            <OurGallery gallery={data.gallery} show_menu={data.show_menu} />
          </section>
        )}

        {data.show_menu.GiftSection && (
          <section id="gift">
            <GiftSection />
          </section>
        )}

        {data.show_menu.wish && import.meta.env.VITE_APP_TABLE_NAME && (
          <section id="wishes">
            <WishSection />
          </section>
        )}

        {data.show_menu.rsvp && import.meta.env.VITE_APP_TABLE_RSVP && (
          <section id="rsvp">
            <RSVPSection />
          </section>
        )}
      </div>

      <Footer />
      <SongButton />
    </div>
  );
}
