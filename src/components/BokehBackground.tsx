import { useMemo } from 'react';

interface BokehDot {
  id: number;
  size: number;
  top: string;
  left: string;
  color: string;
  dur: number;
}

const BOKEH_COLORS = [
  'rgba(244,63,94,0.25)',
  'rgba(251,113,133,0.2)',
  'rgba(255,215,0,0.15)',
  'rgba(255,105,180,0.2)',
  'rgba(255,182,193,0.15)',
];

export function BokehBackground() {
  const dots = useMemo<BokehDot[]>(() => (
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 40,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      color: BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)],
      dur: Math.random() * 6 + 5,
    }))
  ), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {dots.map(d => (
        <div
          key={d.id}
          className="bokeh absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            top: d.top,
            left: d.left,
            background: d.color,
            filter: 'blur(30px)',
            '--dur': `${d.dur}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
