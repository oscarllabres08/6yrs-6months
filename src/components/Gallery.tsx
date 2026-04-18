import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, ChevronDown, ChevronUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_PHOTOS, GALLERY_PHOTOS_MORE } from '../data/content';

interface Photo {
  url: string;
  caption: string;
  rotate: string;
}

function PolaroidCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), index * 120);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    el.classList.add('reveal');
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="relative min-w-0 max-w-full">
      <div
        className="polaroid cursor-pointer max-w-full"
        style={{ '--rotate': photo.rotate } as React.CSSProperties}
        onClick={onClick}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full max-w-full h-36 object-cover gallery-glow transition-shadow duration-300"
          loading="lazy"
          decoding="async"
        />
        <p className="font-cursive text-gray-700 text-sm text-center pt-2 leading-tight">
          {photo.caption} ♡
        </p>
      </div>
    </div>
  );
}

function MorePolaroidCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  return (
    <div
      className="gallery-more-bloom relative min-w-0 max-w-full"
      style={{ '--stagger': index } as React.CSSProperties}
    >
      <div
        className="polaroid cursor-pointer max-w-full transition-shadow duration-300 hover:shadow-[0_0_28px_rgba(244,63,94,0.45)]"
        style={{ '--rotate': photo.rotate } as React.CSSProperties}
        onClick={onClick}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full max-w-full h-36 object-cover gallery-glow transition-shadow duration-300"
          loading="lazy"
          decoding="async"
        />
        <p className="font-cursive text-gray-700 text-sm text-center pt-2 leading-tight">
          {photo.caption} ♡
        </p>
      </div>
    </div>
  );
}

function LightboxModal({
  photos,
  index,
  onNavigate,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onNavigate: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const total = photos.length;
  const [enterDir, setEnterDir] = useState<'next' | 'prev'>('next');

  const goTo = useCallback(
    (nextIndex: number, dir: 'next' | 'prev') => {
      setEnterDir(dir);
      onNavigate(nextIndex);
    },
    [onNavigate]
  );

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    goTo((index - 1 + total) % total, 'prev');
  };
  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    goTo((index + 1) % total, 'next');
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo((index - 1 + total) % total, 'prev');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo((index + 1) % total, 'next');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goTo, index, total]);

  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  /* Portal + high z-index: lightbox lived inside main (z-10) so it stayed below the nav (z-30) and the X was unclickable */
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden overscroll-none"
      style={{
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)',
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(12px, env(safe-area-inset-left))',
        paddingRight: 'max(12px, env(safe-area-inset-right))',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery photo viewer"
    >
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-[max(8px,env(safe-area-inset-left))] top-1/2 z-[210] -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-rose-400/40 bg-black/50 text-rose-100 shadow-lg backdrop-blur-sm transition-colors hover:bg-rose-950/80 hover:text-white touch-manipulation"
        aria-label="Previous photo"
      >
        <ChevronLeft size={26} className="shrink-0" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-[max(8px,env(safe-area-inset-right))] top-1/2 z-[210] -translate-y-1/2 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-rose-400/40 bg-black/50 text-rose-100 shadow-lg backdrop-blur-sm transition-colors hover:bg-rose-950/80 hover:text-white touch-manipulation"
        aria-label="Next photo"
      >
        <ChevronRight size={26} className="shrink-0" strokeWidth={2.5} />
      </button>

      <div
        className="flex min-h-0 w-full max-w-sm max-h-[min(92dvh,calc(100dvh-2rem))] flex-col overflow-hidden fade-slide"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-2 flex shrink-0 justify-end px-1">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-colors hover:bg-rose-700 touch-manipulation"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div
          key={index}
          className={`polaroid flex min-h-0 flex-1 flex-col overflow-hidden pb-3 !pt-2 ${
            enterDir === 'next' ? 'lightbox-photo-enter-next' : 'lightbox-photo-enter-prev'
          }`}
          style={{ '--rotate': '0deg' } as React.CSSProperties}
        >
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden">
            <img
              src={photo.url}
              alt={photo.caption}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <p className="shrink-0 pt-2 text-center font-cursive text-base text-gray-700">{photo.caption} ♡</p>
          <p className="shrink-0 pt-1 text-center text-xs font-light text-gray-500">
            {index + 1} / {total}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Gallery() {
  const allPhotos = useMemo(() => [...GALLERY_PHOTOS, ...GALLERY_PHOTOS_MORE], []);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const moreSectionRef = useRef<HTMLDivElement>(null);

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
    if (!showMore) return;
    const id = requestAnimationFrame(() => {
      moreSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => cancelAnimationFrame(id);
  }, [showMore]);

  return (
    <section id="gallery" className="relative py-20 px-3 sm:px-4 w-full max-w-[100vw] overflow-x-hidden min-w-0" style={{ background: 'linear-gradient(180deg, #1a0a0f 0%, #2d0a18 50%, #1a0a0f 100%)' }}>
      <div ref={headerRef} className="text-center mb-12">
        <p className="font-cursive text-rose-400 text-lg mb-1">captured in time</p>
        <h2 className="shimmer-text font-cursive text-4xl md:text-5xl font-bold mb-3">Our Memories</h2>
        <div className="section-divider" />
        <p className="text-rose-200 text-sm mt-3 font-light tracking-wide">Every picture holds a thousand feelings</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto w-full min-w-0 px-1">
        {GALLERY_PHOTOS.map((photo, i) => (
          <PolaroidCard
            key={i}
            photo={photo}
            index={i}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={() => setShowMore(s => !s)}
          className="group relative overflow-hidden rounded-full px-8 py-3 font-cursive text-lg text-rose-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(244,63,94,0.35) 0%, rgba(190,24,93,0.25) 100%)',
            border: '1px solid rgba(251,113,133,0.45)',
            boxShadow: '0 4px 24px rgba(244,63,94,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-200/90 shrink-0 group-hover:animate-pulse" />
            {showMore ? 'Show less' : 'See more'}
            {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.15), transparent 55%)' }}
          />
        </button>
      </div>

      {showMore && (
        <div
          ref={moreSectionRef}
          className="relative mx-auto mt-12 max-w-4xl w-full px-1"
        >
          <div
            className="pointer-events-none absolute -top-6 left-0 right-0 flex justify-center gap-6 sm:gap-10 text-rose-400/50 select-none gallery-more-hearts"
            aria-hidden
          >
            {['♥', '♡', '♥', '♡', '♥'].map((h, i) => (
              <span key={i} style={{ ['--h' as string]: i } as React.CSSProperties} className="text-xl sm:text-2xl">
                {h}
              </span>
            ))}
          </div>

          <p className="text-center font-cursive text-rose-300/95 text-lg sm:text-xl mb-8 drop-shadow-[0_0_12px_rgba(244,63,94,0.35)]">
            More moments, more magic…
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 w-full min-w-0">
            {GALLERY_PHOTOS_MORE.map((photo, i) => (
              <MorePolaroidCard
                key={`more-${i}`}
                photo={photo}
                index={i}
                onClick={() => setLightboxIndex(GALLERY_PHOTOS.length + i)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center mt-12 gap-2 text-rose-300 px-2 text-center">
        <Heart size={16} className="fill-rose-400 text-rose-400 shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' }} />
        <p className="font-cursive text-base sm:text-lg max-w-[min(100%,20rem)]">Every photo is a memory I treasure</p>
        <Heart size={16} className="fill-rose-400 text-rose-400 shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' }} />
      </div>

      {lightboxIndex !== null && (
        <LightboxModal
          photos={allPhotos}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
