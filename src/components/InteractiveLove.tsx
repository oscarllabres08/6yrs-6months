import { useState, useRef, useCallback, useEffect } from 'react';
import { Heart, Zap } from 'lucide-react';
import { LOVE_MESSAGES } from '../data/content';

interface ExplodeHeart {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
}

const HEART_COLORS = ['#fb7185', '#f43f5e', '#ffd700', '#ff69b4', '#fda4af'];
let heartId = 0;

function PopMessage({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="msg-pop fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-2xl px-5 py-3 text-center pointer-events-none"
      style={{ border: '1px solid rgba(251,113,133,0.4)', maxWidth: '280px' }}
    >
      <p className="font-cursive text-rose-200 text-lg">{message}</p>
    </div>
  );
}

function LoveMeter({ visible }: { visible: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && barRef.current) {
      barRef.current.style.animation = 'none';
      void barRef.current.offsetWidth;
      barRef.current.style.animation = '';
    }
  }, [visible]);

  return (
    <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <p className="font-cursive text-rose-300 text-lg text-center mb-3">How much I love you...</p>
      <div className="glass rounded-full h-5 overflow-hidden mx-auto max-w-xs relative">
        <div
          ref={barRef}
          className="h-full rounded-full love-meter-fill"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold tracking-widest" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>
            INFINITE ♾
          </span>
        </div>
      </div>
      <p className="text-rose-400 text-xs text-center mt-2">Beyond measure, beyond infinity</p>
    </div>
  );
}

export function InteractiveLove() {
  const [hearts, setHearts] = useState<ExplodeHeart[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [meterVisible, setMeterVisible] = useState(false);
  const [kissCount, setKissCount] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    el.classList.add('reveal');
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const explodeHearts = useCallback((x: number, y: number) => {
    const newHearts: ExplodeHeart[] = Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * 2 * Math.PI;
      const dist = Math.random() * 100 + 60;
      return {
        id: heartId++,
        x,
        y,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: Math.random() * 14 + 10,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      };
    });
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)));
    }, 1200);
  }, []);

  const handleSendLove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    explodeHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const msg = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
    setMessage(msg);
  };

  const handleKiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    explodeHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
    setKissCount(c => c + 1);
  };

  return (
    <section id="interactive" className="relative py-20 px-4" style={{ background: 'linear-gradient(180deg, #1a0a0f 0%, #2d0a18 50%, #1a0a0f 100%)' }}>
      <div ref={headerRef} className="text-center mb-12">
        <p className="font-cursive text-rose-400 text-lg mb-1">just for you</p>
        <h2 className="shimmer-text font-cursive text-4xl md:text-5xl font-bold mb-3">Feel the Love</h2>
        <div className="section-divider" />
      </div>

      <div className="max-w-sm mx-auto space-y-8">
        <div className="glass-strong rounded-3xl p-6 text-center glow-rose">
          <p className="text-rose-200 text-sm mb-4 font-light">Press to send your love</p>
          <button
            onClick={handleSendLove}
            className="btn-pulse rounded-full w-24 h-24 mx-auto flex items-center justify-center transition-transform duration-150 active:scale-90"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', boxShadow: '0 0 30px rgba(244,63,94,0.6)' }}
          >
            <Heart size={40} className="fill-white text-white" />
          </button>
          <p className="text-rose-300 text-xs mt-3 font-cursive text-lg">Tap me!</p>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <button
            className="w-full text-center mb-4"
            onClick={() => setMeterVisible(v => !v)}
          >
            <div className="flex items-center justify-center gap-2">
              <Zap size={18} className="text-rose-400" />
              <p className="font-cursive text-rose-300 text-xl">How much I love you?</p>
              <Zap size={18} className="text-rose-400" />
            </div>
          </button>
          <LoveMeter visible={meterVisible} />
        </div>

        <div className="glass-strong rounded-3xl p-6 text-center">
          <p className="text-rose-200 text-sm mb-4 font-light">Send a kiss</p>
          <button
            onClick={handleKiss}
            className="text-5xl transition-transform duration-150 active:scale-75 hover:scale-110 mx-auto block"
            style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.6))' }}
          >
            &#x1F48B;
          </button>
          {kissCount > 0 && (
            <p className="text-rose-300 font-cursive text-lg mt-3 fade-slide">
              {kissCount} kiss{kissCount > 1 ? 'es' : ''} sent with love ♡
            </p>
          )}
        </div>
      </div>

      {hearts.map(h => (
        <span
          key={h.id}
          className="heart-explode text-2xl select-none"
          style={{
            left: h.x,
            top: h.y,
            fontSize: h.size,
            color: h.color,
            '--tx': `${h.tx}px`,
            '--ty': `${h.ty}px`,
            filter: `drop-shadow(0 0 4px ${h.color})`,
          } as React.CSSProperties}
        >
          ♥
        </span>
      ))}

      {message && (
        <PopMessage
          message={message}
          onDone={() => setMessage(null)}
        />
      )}
    </section>
  );
}
