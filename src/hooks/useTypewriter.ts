import { useState, useEffect, useCallback } from 'react';

export function useTypewriter(messages: string[], speed = 60, pause = 2500) {
  const [displayed, setDisplayed] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = messages[msgIndex];
    if (!deleting) {
      if (charIndex < current.length) {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex(i => i + 1);
      } else {
        setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (charIndex > 0) {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex(i => i - 1);
      } else {
        setDeleting(false);
        setMsgIndex(i => (i + 1) % messages.length);
      }
    }
  }, [charIndex, deleting, messages, msgIndex, pause]);

  useEffect(() => {
    const timeout = setTimeout(tick, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [tick, speed, deleting]);

  return displayed;
}
