import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useLiveCounter } from '../hooks/useLiveCounter';
import { ANNIVERSARY_START, LOVE_QUOTES, TYPEWRITER_MESSAGES, COUPLE } from '../data/content';

function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % LOVE_QUOTES.length);
        setVisible(true);
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60px] flex items-center justify-center px-4">
      <p
        className="font-playfair italic text-rose-200 text-center text-sm md:text-base leading-relaxed transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
      >
        &ldquo;{LOVE_QUOTES[index]}&rdquo;
      </p>
    </div>
  );
}

function CounterUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass rounded-xl px-3 py-2 min-w-[52px] text-center glow-rose">
        <span className="font-cursive text-2xl md:text-3xl text-white glow-gold font-bold">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-rose-300 text-xs mt-1 uppercase tracking-widest font-light">{label}</span>
    </div>
  );
}

export function Hero() {
  const text = useTypewriter(TYPEWRITER_MESSAGES, 65, 2200);
  const counter = useLiveCounter(ANNIVERSARY_START);
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCounter(true), 800);
    return () => clearTimeout(t);
  }, []);

  const sparklePositions = [
    { top: '12%', left: '8%', delay: '0s', size: 16 },
    { top: '20%', right: '10%', delay: '0.5s', size: 12 },
    { top: '60%', left: '5%', delay: '1s', size: 14 },
    { top: '75%', right: '8%', delay: '0.3s', size: 10 },
    { top: '35%', left: '3%', delay: '0.8s', size: 11 },
    { top: '45%', right: '4%', delay: '1.2s', size: 13 },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2d0a18 0%, #1a0a0f 50%, #200a15 100%)' }}
    >
      {sparklePositions.map((s, i) => (
        <span
          key={i}
          className="sparkle-star absolute text-rose-300 pointer-events-none select-none"
          style={{
            top: s.top,
            left: (s as { left?: string }).left,
            right: (s as { right?: string }).right,
            fontSize: s.size,
            '--dur': '2.5s',
            '--delay': s.delay,
          } as React.CSSProperties}
        >
          ✦
        </span>
      ))}

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-20 pb-12 w-full max-w-lg mx-auto min-w-0">
        <div
          className="heart-beat mb-4"
          style={{ animationDelay: '0.2s' }}
        >
          <Heart
            className="text-rose-500 fill-rose-500"
            size={48}
            style={{ filter: 'drop-shadow(0 0 12px rgba(244,63,94,0.8))' }}
          />
        </div>

        <div
          className="fade-slide text-center mb-2"
          style={{ animationDelay: '0.3s' }}
        >
          <p className="font-cursive text-rose-300 text-lg tracking-wide">A celebration of</p>
        </div>

        <h1
          className="shimmer-text font-cursive text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight mb-1 fade-slide px-1"
          style={{ animationDelay: '0.5s' }}
        >
          {COUPLE.months} Months
        </h1>

        <p
          className="font-playfair italic text-rose-200 text-xl text-center mb-6 fade-slide"
          style={{ animationDelay: '0.7s' }}
        >
          {COUPLE.years} Years & {COUPLE.extraMonths} Months of Love
        </p>

        <div className="section-divider mb-6" />

        <div
          className="min-h-[48px] sm:min-h-[40px] mb-8 fade-slide w-full px-1"
          style={{ animationDelay: '0.9s' }}
        >
          <p className="font-cursive typewriter-cursor text-pink-300 text-base sm:text-lg md:text-2xl text-center glow-text max-w-[min(100%,22rem)] mx-auto leading-snug break-words hyphens-auto">
            {text}
          </p>
        </div>

        <div
          className={`transition-all duration-1000 ${showCounter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-rose-300 text-xs uppercase tracking-widest text-center mb-4 font-light">
            Together for
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-2">
            <CounterUnit value={counter.years} label="Years" />
            <CounterUnit value={counter.months} label="Months" />
            <CounterUnit value={counter.days} label="Days" />
            <CounterUnit value={counter.hours} label="Hours" />
            <CounterUnit value={counter.minutes} label="Mins" />
            <CounterUnit value={counter.seconds} label="Secs" />
          </div>
          <p className="text-rose-400 text-xs text-center mt-2 font-light">
            That&apos;s {counter.totalDays.toLocaleString()} beautiful days ♡
          </p>
        </div>

        <div className="mt-8 fade-slide" style={{ animationDelay: '1.2s' }}>
          <QuoteCarousel />
        </div>

        <a
          href="#gallery"
          className="mt-10 glass rounded-full px-8 py-3 text-rose-200 text-sm tracking-widest uppercase hover:bg-rose-900/30 transition-all duration-300 glow-rose btn-pulse"
        >
          Explore Our Story
        </a>
      </div>
    </section>
  );
}
