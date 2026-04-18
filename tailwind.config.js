/** @type {import('tailwindcss').Config} */
export default {
  /* Tiyakin na hindi kasama ang nested apps/node_modules sa ilalim ng src (sobrang bagal / tila hang) */
  content: [
    './index.html',
    './src/App.tsx',
    './src/main.tsx',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/data/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['Dancing Script', 'cursive'],
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        romantic: {
          blush: '#ffb6c1',
          rose: '#ff69b4',
          crimson: '#dc143c',
          burgundy: '#800020',
          gold: '#ffd700',
          cream: '#fff5f7',
          dark: '#1a0a0f',
          glass: 'rgba(255,182,193,0.15)',
        },
      },
      animation: {
        'float-heart': 'floatHeart 6s ease-in infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'typewriter': 'typewriter 3s steps(40) forwards',
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'heart-beat': 'heartBeat 1.5s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'confetti-fall': 'confettiFall linear forwards',
        'firework': 'firework 0.6s ease-out forwards',
        'envelope-open': 'envelopeOpen 1s ease forwards',
        'letter-reveal': 'letterReveal 1.5s ease forwards',
        'orbit': 'orbit 4s linear infinite',
      },
      keyframes: {
        floatHeart: {
          '0%': { transform: 'translateY(100vh) scale(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-20px) scale(1) rotate(20deg)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(244,63,94,0.4), 0 0 20px rgba(244,63,94,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(244,63,94,0.8), 0 0 50px rgba(244,63,94,0.4)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.3) rotate(180deg)', opacity: '0.6' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.2)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        firework: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        envelopeOpen: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-180deg)' },
        },
        letterReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
