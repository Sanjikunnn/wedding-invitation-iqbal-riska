import React from 'react';

export default function Footer() {
  return (
    <div className="mt-16 text-center text-white">
      {/* Thanks Section */}
      <div className="mb-6">
        <p className="text-sm">Thanks for watching our love story unfold 🍿</p>
        <p className="text-sm">Season Finale: The Wedding Day ❤️</p>
      </div>

      {/* Divider */}
      <div className="w-24 h-[2px] bg-red-600 mx-auto mb-6"></div>

      {/* Signature / Credit */}
      <div className="text-[10px] text-[#A3A1A1]">
        <p>
          A Digital Invitation Inspired by Netflix🎬
        </p>
        <p className="mt-1">
          Build with ❤️ by&nbsp;
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href="https://www.instagram.com/faizmuhiq/"
          >
            Faizal Muhamad Iqbal
          </a>
        </p>
        <p className="mb-3">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </div>
  );
}
