import { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
  symbol: string;
}

const COLORS = ['#fb7185', '#f43f5e', '#fda4af', '#ffd700', '#ff69b4', '#ffb6c1'];
const SYMBOLS = ['♥', '♡', '❤', '✿', '✦'];

let nextId = 0;

export function FloatingHearts() {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const spawn = () => {
      const heart: HeartParticle = {
        id: nextId++,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 20 + 12,
        duration: Math.random() * 6 + 8,
        delay: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      };
      setHearts(prev => [...prev.slice(-18), heart]);
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== heart.id));
      }, (heart.duration + 1) * 1000);
    };

    const interval = setInterval(spawn, 800);
    for (let i = 0; i < 5; i++) {
      setTimeout(spawn, i * 400);
    }
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {hearts.map(h => (
        <span
          key={h.id}
          className="float-heart-particle select-none"
          style={{
            left: h.left,
            bottom: '-10px',
            fontSize: `${h.size}px`,
            color: h.color,
            animationDuration: `${h.duration}s`,
            filter: `drop-shadow(0 0 4px ${h.color})`,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}
