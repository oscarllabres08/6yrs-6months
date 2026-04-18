export type AudioFocusSource = 'reels';

type AudioFocusAction = 'request' | 'release';

export type AudioFocusEventDetail = {
  action: AudioFocusAction;
  source: AudioFocusSource;
};

const EVENT_NAME = 'app:audio-focus';

export function requestAudioFocus(source: AudioFocusSource) {
  window.dispatchEvent(
    new CustomEvent<AudioFocusEventDetail>(EVENT_NAME, {
      detail: { action: 'request', source },
    })
  );
}

export function releaseAudioFocus(source: AudioFocusSource) {
  window.dispatchEvent(
    new CustomEvent<AudioFocusEventDetail>(EVENT_NAME, {
      detail: { action: 'release', source },
    })
  );
}

export function onAudioFocus(handler: (detail: AudioFocusEventDetail) => void) {
  const listener = (e: Event) => {
    const ce = e as CustomEvent<AudioFocusEventDetail>;
    if (!ce.detail) return;
    handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

