import { useState, useRef, useEffect } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { LOVE_LETTER_TEXT } from '../data/content';

const PARAGRAPHS = LOVE_LETTER_TEXT.split('\n\n').filter(Boolean);

export function LoveLetter() {
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

  const handleOpen = () => {
    if (!opened) setOpened(true);
  };

  return (
    <section
      id="letter"
      className="relative py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #1a0a0f 0%, #2d0a18 50%, #1a0a0f 100%)' }}
    >
      <div ref={headerRef} className="text-center mb-12">
        <p className="font-cursive text-rose-400 text-lg mb-1">written from the heart</p>
        <h2 className="shimmer-text font-cursive text-4xl md:text-5xl font-bold mb-3">A Love Letter</h2>
        <div className="section-divider" />
      </div>

      <div className="max-w-md mx-auto">
        {!opened ? (
          <div className="flex flex-col items-center gap-6">
            <div
              className="glass-strong rounded-2xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300 glow-rose btn-pulse"
              onClick={handleOpen}
            >
              <Mail
                size={56}
                className="text-rose-400"
                style={{ filter: 'drop-shadow(0 0 12px rgba(244,63,94,0.7))' }}
              />
              <p className="font-cursive text-rose-200 text-xl text-center">A letter written just for you</p>
              <p className="text-rose-300 text-sm text-center font-light">Tap to open your letter ♡</p>
            </div>
          </div>
        ) : (
          <div className="fade-slide">
            <div
              className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden"
              style={{ border: '1px solid rgba(251,113,133,0.3)', boxShadow: '0 0 40px rgba(244,63,94,0.15)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{
                background: 'linear-gradient(90deg, #fb7185, #ffd700, #fb7185)',
              }} />

              <div className="text-center mb-6">
                <span className="text-rose-400 text-3xl heart-beat inline-block">♡</span>
              </div>

              <div className={`space-y-4 overflow-hidden transition-all duration-700`} style={{
                maxHeight: expanded ? '2000px' : '340px',
              }}>
                {PARAGRAPHS.map((para, i) => (
                  <p
                    key={i}
                    className={`font-playfair italic leading-relaxed text-sm md:text-base ${
                      i === 0 ? 'text-rose-200 font-semibold text-base not-italic' :
                      i === PARAGRAPHS.length - 1 ? 'text-rose-300 text-right' :
                      'text-rose-100'
                    } fade-slide`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {!expanded && (
                <div className="relative mt-2">
                  <div className="absolute bottom-full left-0 right-0 h-16 pointer-events-none" style={{
                    background: 'linear-gradient(to top, rgba(45,10,24,0.95), transparent)',
                  }} />
                  <button
                    onClick={() => setExpanded(true)}
                    className="w-full flex items-center justify-center gap-2 mt-4 text-rose-300 text-sm hover:text-rose-200 transition-colors"
                  >
                    <span className="font-cursive text-lg">Continue Reading</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}

              {expanded && (
                <div className="text-center mt-6">
                  <span className="text-rose-400 sparkle-star inline-block" style={{ '--dur': '3s', '--delay': '0s' } as React.CSSProperties}>✦</span>
                  <span className="text-rose-400 heart-beat inline-block mx-3 text-2xl">♡</span>
                  <span className="text-rose-400 sparkle-star inline-block" style={{ '--dur': '3s', '--delay': '0.5s' } as React.CSSProperties}>✦</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
