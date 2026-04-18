import { useEffect, useState } from 'react';

interface Piece {
  id: number;
  left: string;
  color: string;
  width: number;
  height: number;
  rot: number;
  dur: number;
  delay: number;
  shape: 'rect' | 'circle' | 'heart';
}

const COLORS = ['#fb7185','#f43f5e','#ffd700','#fda4af','#fff','#ffb6c1','#ff69b4','#e11d48'];

function generatePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: Math.random() * 8 + 5,
    height: Math.random() * 12 + 6,
    rot: Math.random() * 720 + 360,
    dur: Math.random() * 2 + 2.5,
    delay: Math.random() * 2,
    shape: (['rect', 'circle', 'heart'] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setPieces(generatePieces(80));
    const t = setTimeout(() => setDone(true), 6000);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-20px',
            width: p.shape === 'circle' ? p.width : p.width,
            height: p.shape === 'circle' ? p.width : p.height,
            backgroundColor: p.shape !== 'heart' ? p.color : 'transparent',
            color: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'rect' ? '2px' : '0',
            fontSize: p.shape === 'heart' ? `${p.width + 4}px` : undefined,
            '--rot': `${p.rot}deg`,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        >
          {p.shape === 'heart' ? '♥' : null}
        </div>
      ))}
    </div>
  );
}
