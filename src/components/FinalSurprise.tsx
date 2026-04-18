import { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  dist: number;
}

interface FallingParticle {
  id: number;
  left: number; // %
  delayMs: number;
  durMs: number;
  driftPx: number;
  sizePx: number;
  char: '🌹' | '♥' | '♡';
  color?: string;
}

const FW_COLORS = ['#fb7185', '#ffd700', '#fda4af', '#fff', '#f43f5e', '#ffb6c1'];
let fwId = 0;
let fallId = 0;

export function FinalSurprise() {
  const [answered, setAnswered] = useState(false);
  const [fireworks, setFireworks] = useState<FireworkParticle[]>([]);
  const [rosePop, setRosePop] = useState(false);
  const [falling, setFalling] = useState<FallingParticle[]>([]);
  const [secretVisible, setSecretVisible] = useState(false);
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

  useEffect(() => {
    const el = document.getElementById('secret-msg');
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSecretVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const launchFireworks = () => {
    for (let burst = 0; burst < 5; burst++) {
      setTimeout(() => {
        const cx = Math.random() * window.innerWidth;
        const cy = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.1;
        const particles: FireworkParticle[] = Array.from({ length: 20 }, (_, i) => ({
          id: fwId++,
          x: cx,
          y: cy,
          color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
          angle: (i / 20) * 360,
          dist: Math.random() * 80 + 40,
        }));
        setFireworks(prev => [...prev, ...particles]);
        setTimeout(() => setFireworks(prev => prev.filter(p => !particles.find(n => n.id === p.id))), 900);
      }, burst * 300);
    }
  };

  const launchRoseBurst = () => {
    // Respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setRosePop(true);
    const popTimer = window.setTimeout(() => setRosePop(false), 1150);

    const count = 26;
    const chars: FallingParticle['char'][] = ['🌹', '♥', '♡', '🌹', '♥'];
    const particles: FallingParticle[] = Array.from({ length: count }, () => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const left = Math.random() * 100;
      const delayMs = Math.floor(Math.random() * 350);
      const durMs = 2000 + Math.floor(Math.random() * 250);
      const driftPx = (Math.random() - 0.5) * 90;
      const sizePx = char === '🌹' ? 18 + Math.random() * 18 : 14 + Math.random() * 16;
      const color =
        char === '🌹'
          ? undefined
          : Math.random() > 0.5
            ? '#fb7185'
            : '#fda4af';

      return {
        id: fallId++,
        left,
        delayMs,
        durMs,
        driftPx,
        sizePx,
        char,
        color,
      };
    });

    setFalling(prev => [...prev, ...particles]);
    const clearTimer = window.setTimeout(() => {
      setFalling(prev => prev.filter(p => !particles.some(n => n.id === p.id)));
    }, 2500);

    // Cleanup timers if component unmounts quickly
    return () => {
      window.clearTimeout(popTimer);
      window.clearTimeout(clearTimer);
    };
  };

  const handleYes = () => {
    setAnswered(true);
    launchRoseBurst();
    launchFireworks();
  };

  return (
    <section
      id="final"
      className="relative py-20 px-4 pb-32"
      style={{ background: 'linear-gradient(180deg, #1a0a0f 0%, #2d0a18 60%, #1a0a0f 100%)' }}
    >
      <div ref={headerRef} className="text-center mb-14">
        <p className="font-cursive text-rose-400 text-lg mb-1">and so the story continues...</p>
        <h2 className="shimmer-text font-cursive text-4xl md:text-5xl font-bold mb-3">Forever?</h2>
        <div className="section-divider" />
      </div>

      <div className="max-w-sm mx-auto space-y-10">
        <div className="glass-strong rounded-3xl p-8 text-center glow-rose">
          <div className="heart-beat mb-6 inline-block">
            <Heart size={48} className="text-rose-400 fill-rose-400" style={{ filter: 'drop-shadow(0 0 12px rgba(244,63,94,0.7))' }} />
          </div>
          <p className="font-playfair italic text-rose-100 text-lg leading-relaxed mb-6">
            Will you continue this love journey with me?
          </p>

          {!answered ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleYes}
                className="btn-pulse rounded-full py-4 text-white font-bold text-lg tracking-wide transition-all duration-200 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)', boxShadow: '0 4px 20px rgba(244,63,94,0.5)' }}
              >
                Yes, Forever ♥
              </button>
              <p className="text-rose-400 text-xs font-light">(there&apos;s only one answer)</p>
            </div>
          ) : (
            <div className="fade-slide space-y-3">
              <p className="font-cursive text-3xl text-rose-300 glow-text">Always & Forever!</p>
              <div className="flex justify-center gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className="sparkle-star text-rose-400 text-xl"
                    style={{ '--dur': '1.5s', '--delay': `${i * 0.15}s` } as React.CSSProperties}
                  >
                    ✦
                  </span>
                ))}
              </div>
              <p className="text-rose-200 text-sm font-light font-playfair italic">
                I knew you&apos;d say yes. My heart has always known.
              </p>
            </div>
          )}
        </div>

        <div id="secret-msg" className="text-center min-h-[60px]">
          {secretVisible && (
            <div className="fade-slide glass rounded-2xl p-5">
              <p className="font-cursive text-rose-300 text-xl mb-2">You scrolled all the way here...</p>
              <p className="font-playfair italic text-rose-100 text-sm leading-relaxed">
                That means you care. And I want you to know — I see it, I feel it, and I love you for every moment of it. Here&apos;s a secret: I fall in love with you over and over, every single day.
              </p>
              <p className="text-rose-400 font-cursive text-2xl mt-3">&#x2665; With all my love</p>
            </div>
          )}
        </div>
      </div>

      {fireworks.map(p => (
        <span
          key={p.id}
          className="fixed pointer-events-none text-sm z-[9998]"
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            '--tx': `${Math.cos((p.angle * Math.PI) / 180) * p.dist}px`,
            '--ty': `${Math.sin((p.angle * Math.PI) / 180) * p.dist}px`,
            animation: 'heartExplode 0.9s ease-out forwards',
            filter: `drop-shadow(0 0 4px ${p.color})`,
          } as React.CSSProperties}
        >
          ♥
        </span>
      ))}

      {rosePop && (
        <div className="fixed inset-0 z-[9997] pointer-events-none flex items-center justify-center">
          <span
            className="rose-pop"
            aria-hidden
            style={{
              filter:
                'drop-shadow(0 0 22px rgba(244,63,94,0.45)) drop-shadow(0 0 46px rgba(255,215,0,0.18))',
            }}
          >
            🌹
          </span>
        </div>
      )}

      {falling.map(p => (
        <span
          key={p.id}
          className="fixed pointer-events-none z-[9996] rose-fall"
          aria-hidden
          style={{
            left: `${p.left}%`,
            top: '-8vh',
            fontSize: `${p.sizePx}px`,
            color: p.color,
            '--delay': `${p.delayMs}ms`,
            '--dur': `${p.durMs}ms`,
            '--drift': `${p.driftPx}px`,
          } as React.CSSProperties}
        >
          {p.char}
        </span>
      ))}
    </section>
  );
}
