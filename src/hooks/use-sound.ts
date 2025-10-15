
'use client';
import { useCallback, useEffect, useState } from 'react';

// A tiny, simple sound effect library
const zzfx = (
  p = 1,
  k = 0.05,
  b = 220,
  e = 0,
  r = 0,
  t = 0.1,
  q = 0,
  D = 1,
  u = 0,
  y = 0,
  v = 0,
  z = 0,
  l = 0,
  E = 0,
  A = 0,
  F = 0,
  c = 0,
  w = 1,
  m = 0,
  B = 0
) => {
  if (typeof window === 'undefined') return () => {};
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const G = 44100;
  const K = 2 * Math.PI;
  const L = u *= 500 * K / G / G;
  const C = b *= (1 + 2 * k * Math.random() - k) * K / G;
  const g = 0;
  const d = 0;
  let a = 0;
  let M = 0;
  let x = 0;
  let N = 0;
  let O = 0;
  const P = [];
  r = G * r + e * G;
  A *= G;
  F *= G;
  m *= 500 * K / G ** 3;
  c *= K / G;
  y *= K / G;
  v *= K / G;
  z *= G;
  l = G * l | 0;
  for (let H = e * G | 0; a < r; ++a) {
    N = a / G;
    M = a / G * D | 0;
    x = (N % (1 / D) * D) ** u * 2 - 1;
    x = (Math.abs(x) < t ? x / t : Math.sign(x) * (1 + (Math.abs(x) - 1) * q));
    x = Math.max(-1, Math.min(1, x));
    P[a] = (Math.sin(a * C * (1 + F * N)) + x) * p * Math.max(0, w - N) * (N < E ? N / E : 1 - (N - E) / (r / G - E));
    C += (l ? (l > a ? 1 : -1) * m : 0) + (1 + 1e-9 * Math.sin(a * c)) * y + v;
  }
  const buffer = audioContext.createBuffer(1, r, G);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < r; ++i) {
    channelData[i] = P[i];
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  return source;
};

const sounds = {
    // A subtle click for general interactions
    click: () => zzfx(0.5, .01, 250, .01, .01, .01, 1, .3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0),
    // A soft sound for starting a process
    start: () => zzfx(0.8, .05, 300, .1, .2, .2, 1, 1.5, .1, 0, 0, 0, .1, .1, 0, .1, 0, .8, 0, 0),
    // A satisfying sound for success
    success: () => zzfx(1, .1, 520, .1, .3, .2, 2, 1.9, 0, 0, .2, .01, 0, .5, 0, 0, 0, .8, .05, 0),
    // A dissonant sound for errors
    error: () => zzfx(1, .1, 120, .2, .5, .8, 3, 1.5, 0, 0, 0, .02, .8, .8, .1, .1, .4, .8, .1, 0),
    // A swoosh sound for sending a message
    send: () => zzfx(0.7, .1, 880, .05, .2, .1, 1, .8, 0, 0, 0, .05, 0, .3, 0, 0, 0, 1, .1, 0),
    // A gentle pop for receiving a message
    receive: () => zzfx(0.7, .1, 660, .05, .2, .1, 1, .8, 0, 0, 0, 0, 0, .3, .1, 0, 0, 1, .1, 0),
    // A chime for saving
    save: () => zzfx(1, .1, 780, .05, .2, .2, 1, 1.5, 0, 0, 0, .01, 0, .4, .1, 0, 0, .8, .05, 0),
};

type SoundType = keyof typeof sounds;

export function useSound() {
  const [isEnabled, setIsEnabled] = useState(true);

  // In a real app, you might get this from a settings context
  // For now, we just assume it's always enabled

  const playSound = useCallback((sound: SoundType) => {
    if (isEnabled && typeof window !== 'undefined') {
      try {
        const source = sounds[sound]();
        source.start(0);
      } catch (e) {
        console.error("Could not play sound", e);
      }
    }
  }, [isEnabled]);

  // Add global click listener
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if(target.closest('button, a, [role="button"], [role="link"]')) {
            playSound('click');
        }
    }
    window.addEventListener('click', handleClick);
    return () => {
        window.removeEventListener('click', handleClick);
    }
  }, [playSound]);

  return playSound;
}
