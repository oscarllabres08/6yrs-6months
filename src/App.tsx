import { FloatingHearts } from './components/FloatingHearts';
import { BokehBackground } from './components/BokehBackground';
import { Confetti } from './components/Confetti';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { Reels } from './components/Reels';
import { LoveLetter } from './components/LoveLetter';
import { InteractiveLove } from './components/InteractiveLove';
import { FinalSurprise } from './components/FinalSurprise';
import { MusicPlayer } from './components/MusicPlayer';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#reels', label: 'Reels' },
  { href: '#letter', label: 'Letter' },
  { href: '#interactive', label: 'Love' },
  { href: '#final', label: 'Forever' },
];

function NavBar() {
  return (
    <nav className="pointer-events-none fixed top-0 left-0 right-0 z-30 flex justify-center py-3 px-2 sm:px-4 max-w-[100vw] overflow-hidden">
      <div className="pointer-events-auto glass rounded-full px-2 sm:px-4 py-2 flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide max-w-[min(100%,calc(100vw-16px))] min-w-0 [-webkit-overflow-scrolling:touch]">
        {NAV_LINKS.map(link => (
          <a
            key={link.href}
            href={link.href}
            className="text-rose-200 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest whitespace-nowrap shrink-0 hover:text-white transition-colors duration-200 font-light"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden min-w-0" style={{ background: '#1a0a0f' }}>
      <BokehBackground />
      <FloatingHearts />
      <Confetti />
      <NavBar />

      <main className="relative z-10 w-full min-w-0 overflow-x-hidden pb-28">
        <Hero />
        <Gallery />
        <Reels />
        <LoveLetter />
        <InteractiveLove />
        <FinalSurprise />
      </main>

      <MusicPlayer />
    </div>
  );
}
