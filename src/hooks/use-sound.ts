
'use client';
import { zzfx } from '@/lib/zzfx';

// A custom hook to play sound effects
export const useSound = () => {

  const playClick = () => {
    // A simple click sound
    zzfx(...[1.05, , 224, 0.02, 0.02, 0.08, 1, 1.72, -13.9, , , , 0.19, , 0.2, , 0.43, 0.02]);
  };
  
  const playGenerate = () => {
    // A success/generate sound
    zzfx(...[1.5, , 650, .05, .2, .3, 4, 1.5, , , 580, .02, .02, , , , .08, .5, .1]);
  };

  const playError = () => {
    // An error sound
    zzfx(...[1.5, ,349,.04,.13,.29,2,.1,-9.5,3.2,,,,,,.1,.6,.02,.33]);
  }

  // You can add more sounds here
  // e.g., playHover, playSuccess, etc.

  return [playClick, playGenerate, playError];
};
