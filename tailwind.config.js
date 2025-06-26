/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1.5s ease-out forwards',
        fadeOut: 'fadeOut 8s ease-out forwards',
        slideUp: 'slideUp 0.7s ease-out',
        popIn: 'popIn 0.7s ease-in-out',
        fadeCinematic: 'fadeCinematic 2s ease-out forwards',
        zoomSlow: 'zoomSlow 6s ease-out forwards',
        bounceIn: 'bounceIn 0.8s ease-out forwards',
        shimmer: 'shimmer 1.5s linear infinite',
        pulse: 'pulse 1.5s ease-in-out infinite',
        wave: 'wave 4s ease-in-out infinite',
        waveright: 'waveright 3s ease-in-out infinite alternate',
        waveleft: 'waveleft 3s ease-in-out infinite alternate',
        shimmerx: 'shimmerx 5s linear infinite',

      },
      keyframes: {
        shimmerx: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(-3px)' },
          '50%': { transform: 'translateX(3px)' },
        },
        waveright: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        waveleft: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        fadeCinematic: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        zoomSlow: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    }
  },
  plugins: [],
};
