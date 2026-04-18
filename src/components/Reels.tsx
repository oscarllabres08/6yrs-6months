import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Film, Volume2, VolumeX, X, Play, LayoutGrid } from 'lucide-react';
import { REELS } from '../data/content';
import { releaseAudioFocus, requestAudioFocus } from '../utils/audioFocus';

const FULL_SLIDE_H = 'min(720px, 88dvh)';
/** ~50% ng dating reel height */
const PREVIEW_SLIDE_H = 'min(360px, 44dvh)';

function pauseAllVideosIn(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll<HTMLVideoElement>('video').forEach(v => {
    v.pause();
  });
}

function FullReelPlayerModal({
  startIndex,
  muted,
  onMutedChange,
  onClose,
}: {
  startIndex: number;
  muted: boolean;
  onMutedChange: (m: boolean) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const slides = root.querySelectorAll<HTMLElement>('[data-reel-slide]');
    const first = slides[startIndex];
    if (first) {
      root.scrollTop = first.offsetTop;
    }
  }, [startIndex]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-reel-slide]'));

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const slide = entry.target as HTMLElement;
          const video = slide.querySelector<HTMLVideoElement>('video[data-reel]');
          if (!video) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.muted = muted;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { root, threshold: [0, 0.35, 0.5, 0.65, 1] }
    );

    slides.forEach(slide => io.observe(slide));
    return () => io.disconnect();
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/92 backdrop-blur-md"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(12px, env(safe-area-inset-left))',
        paddingRight: 'max(12px, env(safe-area-inset-right))',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Reels player"
    >
      <div className="mb-2 flex w-full max-w-md shrink-0 items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={() => onMutedChange(!muted)}
          className="glass rounded-full px-3 py-2 flex items-center gap-2 text-rose-200 text-xs uppercase tracking-widest hover:text-white transition-colors touch-manipulation"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {muted ? 'Sound off' : 'Sound on'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-colors hover:bg-rose-700 touch-manipulation"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-md snap-y snap-mandatory overflow-y-auto overflow-x-hidden rounded-2xl border border-rose-500/25 shadow-[0_0_40px_rgba(244,63,94,0.15)] scrollbar-hide"
        style={{ height: FULL_SLIDE_H, WebkitOverflowScrolling: 'touch' as const }}
      >
        {REELS.map((reel, i) => (
          <article
            key={i}
            data-reel-slide
            className="relative snap-start snap-always shrink-0 w-full overflow-hidden bg-black"
            style={{ height: FULL_SLIDE_H }}
          >
            <video
              data-reel
              className="absolute inset-0 h-full w-full object-cover"
              src={reel.src}
              playsInline
              muted={muted}
              loop
              preload="metadata"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6 pt-20">
              <p className="font-cursive text-xl sm:text-2xl text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-snug">
                {reel.caption}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
                {i + 1} / {REELS.length}
              </p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-2 max-w-md text-center text-[11px] text-rose-200/60">Swipe up or down for the next reel</p>
    </div>,
    document.body
  );
}

function AllReelsGridModal({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (index: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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

  return createPortal(
    <div
      className="fixed inset-0 z-[205] flex flex-col overflow-hidden bg-black/90 backdrop-blur-md"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(12px, env(safe-area-inset-left))',
        paddingRight: 'max(12px, env(safe-area-inset-right))',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="All reels"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-rose-500/20 px-2 pb-3 pt-1">
        <h3 className="font-cursive text-xl text-rose-100">All reels</h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 touch-manipulation"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-4">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {REELS.map((reel, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onPick(i)}
              className="group relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-rose-500/30 bg-black text-left shadow-lg transition-transform active:scale-[0.98] touch-manipulation"
            >
              <video
                className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                src={reel.src}
                muted
                playsInline
                preload="metadata"
                tabIndex={-1}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/15">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white ring-2 ring-rose-300/80">
                  <Play size={22} className="ml-0.5" fill="currentColor" />
                </span>
              </span>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-8">
                <span className="line-clamp-2 font-cursive text-xs text-white/95">{reel.caption}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Reels() {
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const previewRootRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [playerStartIndex, setPlayerStartIndex] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  const openPlayerAt = useCallback((index: number) => {
    setPlayerStartIndex(index);
    setPlayerOpen(true);
    setGridOpen(false);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    el.classList.add('reveal');
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Preview strip: auto-play muted habang naka-center (hindi kapag bukas ang modal) */
  useEffect(() => {
    if (playerOpen || gridOpen) {
      pauseAllVideosIn(previewRootRef.current);
      return;
    }

    const root = previewScrollRef.current;
    if (!root) return;

    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-reel-preview-slide]'));

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const slide = entry.target as HTMLElement;
          const video = slide.querySelector<HTMLVideoElement>('video[data-reel-preview]');
          if (!video) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { root, threshold: [0, 0.45, 0.55, 0.65, 1] }
    );

    slides.forEach(slide => io.observe(slide));
    return () => io.disconnect();
  }, [playerOpen, gridOpen]);

  useEffect(() => {
    if (playerOpen || gridOpen) {
      pauseAllVideosIn(previewRootRef.current);
    }
  }, [playerOpen, gridOpen]);

  useEffect(() => {
    if (playerOpen && !muted) {
      requestAudioFocus('reels');
      return () => releaseAudioFocus('reels');
    }
    releaseAudioFocus('reels');
    return () => {};
  }, [playerOpen, muted]);

  return (
    <section
      id="reels"
      className="relative scroll-mt-24 py-16 px-3 sm:px-4 w-full max-w-[100vw] overflow-x-hidden min-w-0"
      style={{ background: 'linear-gradient(180deg, #1a0a0f 0%, #2d0a18 40%, #1a0a0f 100%)' }}
    >
      <div ref={headerRef} className="text-center mb-8">
        <p className="font-cursive text-rose-400 text-lg mb-1 flex items-center justify-center gap-2">
          <Film size={18} className="inline shrink-0" />
          moments in motion
        </p>
        <h2 className="shimmer-text font-cursive text-4xl md:text-5xl font-bold mb-3">Our Reels</h2>
        <div className="section-divider" />
        <p className="text-rose-200/80 text-sm mt-3 font-light tracking-wide max-w-md mx-auto px-1">
          Slide left or right for the next preview — tap a reel to watch full screen. Sound sa player ♡
        </p>
      </div>

      <div ref={previewRootRef} className="mx-auto w-full max-w-lg">
        <div
          ref={previewScrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-2 pt-1 scrollbar-hide [-webkit-overflow-scrolling:touch]"
          style={{
            paddingLeft: 'max(1rem, calc(50% - min(101.25px, (min(360px, 44dvh) * 9) / 32)))',
            paddingRight: 'max(1rem, calc(50% - min(101.25px, (min(360px, 44dvh) * 9) / 32)))',
          }}
        >
          {REELS.map((reel, i) => (
            <article
              key={i}
              data-reel-preview-slide
              className="snap-center shrink-0 cursor-pointer"
              style={{ height: PREVIEW_SLIDE_H }}
            >
              <button
                type="button"
                onClick={() => openPlayerAt(i)}
                className="relative h-full overflow-hidden rounded-2xl border border-rose-500/35 bg-black text-left shadow-[0_8px_32px_rgba(0,0,0,0.45)] outline-none ring-rose-400/0 transition-[box-shadow,transform] hover:ring-2 hover:ring-rose-400/40 active:scale-[0.98] touch-manipulation aspect-[9/16]"
                aria-label={`Play reel ${i + 1}: ${reel.caption}`}
              >
                <video
                  data-reel-preview
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  src={reel.src}
                  playsInline
                  muted
                  loop
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white ring-2 ring-white/40 backdrop-blur-sm">
                    <Play size={20} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 px-2 pb-3 pt-12">
                  <p className="line-clamp-2 font-cursive text-sm leading-tight text-white/90 drop-shadow-md">{reel.caption}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">{i + 1} / {REELS.length}</p>
                </div>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setGridOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/45 bg-rose-950/40 px-5 py-2.5 font-cursive text-base text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-colors hover:bg-rose-900/50 hover:text-white touch-manipulation"
          >
            <LayoutGrid size={18} className="shrink-0 opacity-90" />
            See all
          </button>
        </div>
      </div>

      {playerOpen && (
        <FullReelPlayerModal
          startIndex={playerStartIndex}
          muted={muted}
          onMutedChange={setMuted}
          onClose={() => setPlayerOpen(false)}
        />
      )}

      {gridOpen && (
        <AllReelsGridModal
          onClose={() => setGridOpen(false)}
          onPick={openPlayerAt}
        />
      )}
    </section>
  );
}
