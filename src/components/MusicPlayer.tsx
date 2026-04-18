import { useState, useEffect, useRef, useMemo } from 'react';
import { Music, Play, Pause, SkipForward } from 'lucide-react';
import { onAudioFocus } from '../utils/audioFocus';

interface Track {
  url: string;
  title: string;
  artist: string;
}

function buildTracks(): Track[] {
  const modules = import.meta.glob<{ default: string }>('../*.mp3', { eager: true });
  const list: Track[] = Object.entries(modules).map(([path, mod]) => {
    const file = path.split('/').pop() ?? '';
    const title = file.replace(/\.mp3$/i, '').replace(/_/g, ' ');
    return { url: mod.default, title, artist: '' };
  });
  list.sort((a, b) => {
    if (/through the years/i.test(a.title)) return -1;
    if (/through the years/i.test(b.title)) return 1;
    return a.title.localeCompare(b.title);
  });
  return list;
}

interface Note {
  id: number;
  left: string;
  char: string;
}
let noteId = 0;

export function MusicPlayer() {
  const TRACKS = useMemo(buildTracks, []);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [awaitingGesture, setAwaitingGesture] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const notesTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const skipInitialTrackEffect = useRef(true);
  const autoAdvanceRef = useRef(false);
  const focusOwnerRef = useRef<null | 'reels'>(null);
  const pausedByFocusRef = useRef(false);
  const shouldResumeAfterFocusRef = useRef(false);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    return onAudioFocus(({ action, source }) => {
      const el = audioRef.current;
      if (!el) return;

      if (action === 'request') {
        focusOwnerRef.current = source;
        if (!el.paused) {
          shouldResumeAfterFocusRef.current = true;
          pausedByFocusRef.current = true;
          el.pause();
        } else {
          shouldResumeAfterFocusRef.current = false;
        }
        return;
      }

      if (action === 'release') {
        if (focusOwnerRef.current === source) {
          focusOwnerRef.current = null;
        }
        if (pausedByFocusRef.current && shouldResumeAfterFocusRef.current) {
          pausedByFocusRef.current = false;
          shouldResumeAfterFocusRef.current = false;
          el.play().catch(() => setAwaitingGesture(true));
        } else {
          pausedByFocusRef.current = false;
          shouldResumeAfterFocusRef.current = false;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (playing) {
      notesTimer.current = setInterval(() => {
        const note: Note = {
          id: noteId++,
          left: `${Math.random() * 70 + 15}%`,
          char: ['♩', '♪', '♫', '♬', '♭'][Math.floor(Math.random() * 5)],
        };
        setNotes(prev => [...prev.slice(-10), note]);
        setTimeout(() => setNotes(prev => prev.filter(n => n.id !== note.id)), 2200);
      }, 500);
    } else {
      if (notesTimer.current) clearInterval(notesTimer.current);
    }
    return () => { if (notesTimer.current) clearInterval(notesTimer.current); };
  }, [playing]);

  // Autoplay first track (Through the years first when sorted)
  useEffect(() => {
    const el = audioRef.current;
    if (!el || TRACKS.length === 0) return;
    el.src = TRACKS[0].url;
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setAwaitingGesture(true));
  }, [TRACKS]);

  // Skip or track ended: load new file; play only if already playing
  useEffect(() => {
    if (skipInitialTrackEffect.current) {
      skipInitialTrackEffect.current = false;
      return;
    }
    const el = audioRef.current;
    if (!el || !TRACKS[trackIndex]) return;
    el.pause();
    el.src = TRACKS[trackIndex].url;
    el.load();
    const shouldAutoPlay = playingRef.current || autoAdvanceRef.current;
    autoAdvanceRef.current = false;
    if (shouldAutoPlay) {
      el.play().catch(() => setAwaitingGesture(true));
    }
  }, [trackIndex, TRACKS]);

  // When autoplay is blocked: tap, scroll, wheel, or swipe (touch) counts as a user gesture to start audio
  useEffect(() => {
    if (!awaitingGesture) return;

    const isOnMusicPlayer = (target: EventTarget | null) =>
      Boolean(target && (target as HTMLElement).closest?.('[data-music-player]'));

    const tryUnlock = () => {
      const el = audioRef.current;
      if (!el || TRACKS.length === 0) return;
      if (!el.src) el.src = TRACKS[trackIndex].url;
      el.play()
        .then(() => {
          setPlaying(true);
          setAwaitingGesture(false);
        })
        .catch(() => {});
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isOnMusicPlayer(e.target)) return;
      tryUnlock();
    };

    const onScroll = () => {
      tryUnlock();
    };

    const onWheel = () => {
      tryUnlock();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isOnMusicPlayer(e.target)) return;
      tryUnlock();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isOnMusicPlayer(e.target)) return;
      tryUnlock();
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [awaitingGesture, TRACKS, trackIndex]);

  const nextTrack = () => setTrackIndex(i => (i + 1) % Math.max(TRACKS.length, 1));
  const track = TRACKS[trackIndex] ?? { title: 'Add .mp3 files to src/', artist: '', url: '' };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || TRACKS.length === 0) return;
    if (!playing && focusOwnerRef.current === 'reels') return;
    if (playing) {
      el.pause();
    } else {
      if (!el.src) el.src = TRACKS[trackIndex].url;
      el.play()
        .then(() => setAwaitingGesture(false))
        .catch(() => setAwaitingGesture(true));
    }
  };

  const bars = Array.from({ length: 5 });

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-40 w-[min(calc(100vw-32px),24rem)]"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
      data-music-player
    >
      <audio
        ref={audioRef}
        className="hidden"
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          autoAdvanceRef.current = true;
          setTrackIndex(i => (i + 1) % Math.max(TRACKS.length, 1));
        }}
      />

      <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3" style={{
        border: '1px solid rgba(251,113,133,0.35)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 20px rgba(244,63,94,0.15)',
      }}>
        <div className="flex-shrink-0">
          {playing ? (
            <div className="flex items-end gap-[3px] h-7">
              {bars.map((_, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-rose-400"
                  style={{
                    animation: `equalizerBar${i + 1} 0.${5 + i}s ease-in-out infinite alternate`,
                    height: `${Math.random() * 16 + 8}px`,
                    animationDuration: `${0.4 + i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <Music size={24} className="text-rose-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{track.title}</p>
          <p className="text-rose-300 text-xs truncate font-light">
            {awaitingGesture ? 'Scroll or tap to play ♪' : (track.artist || '♡')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={nextTrack}
            disabled={TRACKS.length < 2}
            className="text-rose-300 hover:text-rose-200 transition-colors disabled:opacity-30"
          >
            <SkipForward size={16} />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-90"
            style={{ background: playing ? '#f43f5e' : 'rgba(244,63,94,0.7)', boxShadow: playing ? '0 0 15px rgba(244,63,94,0.6)' : 'none' }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {notes.map(n => (
        <span
          key={n.id}
          className="music-note absolute pointer-events-none text-rose-300 text-lg select-none"
          style={{ left: n.left, bottom: '60px' }}
        >
          {n.char}
        </span>
      ))}

      <style>{`
        @keyframes equalizerBar1 { from { height: 6px; } to { height: 22px; } }
        @keyframes equalizerBar2 { from { height: 14px; } to { height: 8px; } }
        @keyframes equalizerBar3 { from { height: 8px; } to { height: 20px; } }
        @keyframes equalizerBar4 { from { height: 18px; } to { height: 6px; } }
        @keyframes equalizerBar5 { from { height: 10px; } to { height: 24px; } }
      `}</style>
    </div>
  );
}
