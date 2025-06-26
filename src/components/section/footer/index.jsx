import React from 'react';

export default function Footer() {
  return (
    <div>
      <div className="mt-8 flex flex-col  items-center">
        <p className="text-white text-sm">
          Thank you for checking up all the things up there!
        </p>
        <p className="text-white text-sm">Can’t wait to see u again! &lt;3</p>
      </div>
      <div className="mt-8 flex flex-col items-center">
        <p className="text-[10px] text-[#A3A1A1] mb-6">
          E-Invitation made with ♥ by{' '}
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href="https://www.github.com/sanjikunnn"
          >
            Faizal Muhamad Iqbal
          </a>
        </p>
      </div>
    </div>
  );
}
