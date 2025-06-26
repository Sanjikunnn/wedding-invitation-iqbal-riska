import React from 'react';
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
  return (
    <div className="space-y-5 pb-10">
      <video className="w-full" autoPlay muted>
        <source src={data.url_video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="px-4 space-y-4">
        <TitleInfo />
        {data.show_menu.breaking_news && <BreakingNews />}
        {data.show_menu.wedding_event && (
          <WeddingEventDetailsWithMap />
        )}
        {data.show_menu.bride_and_groom && <Bridegroom />}
        {data.show_menu.love_story && <LoveStory />}
        {data.show_menu.gallery && (
          <OurGallery gallery={data.gallery} show_menu={data.show_menu} />
        )}
        {data.show_menu.GiftSection && <GiftSection />}
        {data.show_menu.wish && import.meta.env.VITE_APP_TABLE_NAME ? (
          <WishSection />
        ) : null}
        {data.show_menu.rsvp && import.meta.env.VITE_APP_TABLE_RSVP ? (
          <RSVPSection />
        ) : null}
      </div>
      <Footer />
      <SongButton />
    </div>
  );
}
