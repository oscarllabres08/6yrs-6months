import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(className = 'reveal') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
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

    el.classList.add(className);
    observer.observe(el);
    return () => observer.disconnect();
  }, [className]);

  return ref;
}

export function useScrollRevealAll(className = 'reveal') {
  useEffect(() => {
    const elements = document.querySelectorAll(`.${className}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [className]);
}
