
"use strict";

// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
//
// MIT License
//
// Copyright (c) 2019 Frank Force
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// This is a compacted version of ZzFX. The original and more readable version
// can be found at https://github.com/KilledByAPixel/ZzFX

// This file is designed to be used as a module.
// It checks for the existence of 'window' to support server-side rendering.
let zzfx: (...args: any[]) => void = () => {};

if (typeof window !== 'undefined') {
  let zzfxV = .3;    // volume
  let zzfxR = 44100; // sample rate
  let zzfxX: AudioContext;

  const getAudioContext = () => {
    if (!zzfxX) {
      zzfxX = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return zzfxX;
  };
  
  zzfx = (...t) => {
    const X = getAudioContext();
    const b = X.createBuffer(t.length, t[0].length * zzfxR, zzfxR);
    
    t.map((d, i) => {
        const e = b.getChannelData(i);
        let S = 0, L = 0, j = 0, C = 0, k = 0, l = 0, g = 0, m = 1, p = 0;

        const [
            volume = 1, 
            randomness = .05, 
            frequency = 220, 
            attack = 0, 
            sustain = 0, 
            release = .1, 
            shape = 0, 
            shapeCurve = 1, 
            slide = 0, 
            deltaSlide = 0, 
            pitchJump = 0, 
            pitchJumpTime = 0, 
            repeatTime = 0, 
            noise = 0, 
            modulation = 0, 
            bitCrush = 0, 
            delay = 0, 
            sustainVolume = 1, 
            decay = 0, 
            tremolo = 0
        ] = d;

        const T = attack + sustain + release + decay + delay;

        for (j = 0; j < T * zzfxR; j++) {
            if (L > 0 && ++L > repeatTime * zzfxR) {
                L = 0;
                k = pitchJump;
                g = 0;
                l = 0;
            }

            if (!L || j > pitchJumpTime * zzfxR) {
                k = 0;
                g = 0;
                l = 1;
            }

            p = j / zzfxR;
            S = (p < attack) ? p / attack :
                (p < attack + sustain) ? sustainVolume :
                (p < attack + sustain + release) ? (1 - (p - attack - sustain) / release) * sustainVolume :
                (p < T - delay) ? (1 - (p - attack - sustain - release) / decay) * sustainVolume :
                0;

            S = S > 0 ? S ** 2 : 0;
            p = (frequency + k) * (1 + randomness * (Math.random() * 2 - 1) + (tremolo ? Math.sin(2 * Math.PI * 7 * p) * tremolo : 0));
            p *= (1 + Math.sin(2 * Math.PI * p * modulation / zzfxR));
            p = Math.max(0, p);

            C += p / zzfxR;
            k += slide + g;
            g += deltaSlide;

            let v = Math.sin(C * 2 * Math.PI * l);
            if (shape == 1) v = v > 0 ? 1 : -1;
            if (shape == 2) v = 2 * (C % 1) - 1;
            if (shape == 3) {
                let x = C % 1;
                v = x < .5 ? 4 * x - 1 : 4 * (1-x) - 1;
            }
            if (shape == 4) v = Math.sin(C**2*Math.PI*4);
            if(noise) v = (Math.random() * 2 - 1) * noise;

            v *= S * volume * zzfxV;
            v = bitCrush ? Math.round(v * bitCrush) / bitCrush : v;
            e[j] = v;
        }
    });

    const s = X.createBufferSource();
    s.buffer = b;
    s.connect(X.destination);
    s.start();
    return s;
  };
}

export { zzfx };
