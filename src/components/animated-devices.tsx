
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Canvas } from '@react-three/fiber'


const codeSnippet = `
<div className="App">
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
</div>
<style>
  .App {
    text-align: center;
  }
  .App-logo {
    height: 40vmin;
    pointer-events: none;
  }
</style>
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}
// This is a comment
const x = 10;
const y = 20;
const z = x + y;
`;

const Laptop = () => (
  <div className="relative mx-auto w-[280px] h-[180px] sm:w-[320px] sm:h-[210px] md:w-[380px] md:h-[240px] bg-gray-800 dark:bg-gray-900 rounded-t-xl border-x-4 border-b-4 border-gray-700 dark:border-gray-800">
    {/* Screen */}
    <div className="absolute inset-x-2 top-2 bottom-4 rounded-lg bg-black overflow-hidden">
      {/* Header */}
      <div className="h-6 flex items-center justify-start px-2 gap-1.5 bg-gray-900">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
      {/* Code */}
      <pre className="p-2 font-mono text-[5px] sm:text-[6px] text-gray-300 whitespace-pre-wrap">
        <span className="text-purple-400">const</span> <span className="text-green-300">App</span> = () =&gt; ( ... );
      </pre>
    </div>
    {/* Base */}
    <div className="absolute bottom-[-16px] left-[-4px] w-full h-4 bg-gray-700 dark:bg-gray-800 rounded-b-md" style={{ transform: 'perspective(30px) rotateX(-5deg)' }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-900 dark:bg-black rounded-full" />
    </div>
  </div>
);

const Phone = () => (
  <div className="relative mx-auto w-[120px] h-[240px] sm:w-[140px] sm:h-[280px] bg-gray-900 dark:bg-black rounded-3xl border-4 border-gray-700 dark:border-gray-800 shadow-2xl overflow-hidden">
    {/* Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 dark:bg-black rounded-b-lg z-10" />
    {/* Screen Content */}
    <div className="absolute inset-1 rounded-2xl overflow-hidden">
      <div className="w-full h-full bg-gray-800">
        <div className="phone-scroll-animation">
          <pre className="p-2 font-mono text-[6px] text-gray-300 whitespace-pre-wrap">
            {codeSnippet.repeat(2)}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

const MatrixRain = () => {
    useEffect(() => {
        const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.parentElement!.clientWidth;
        let h = canvas.height = canvas.parentElement!.clientHeight;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        const cols = Math.floor(w / 20) + 1;
        const ypos = Array(cols).fill(0);

        function matrix() {
            if(!ctx) return;
            ctx.fillStyle = '#0001';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#0f0';
            ctx.font = '15pt monospace';

            ypos.forEach((y, ind) => {
                const text = String.fromCharCode(Math.random() * 128);
                const x = ind * 20;
                ctx.fillText(text, x, y);
                if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
                else ypos[ind] = y + 20;
            });
        }
        
        const interval = setInterval(matrix, 50);
        return () => clearInterval(interval);

    }, []);

    return <canvas id="matrix-canvas" className="absolute inset-0 w-full h-full rounded-lg"></canvas>;
}


export default function AnimatedDevices() {
  const [activeDevice, setActiveDevice] = useState(0); // 0: Laptop, 1: Phone, 2: Matrix

  useEffect(() => {
    const sequence = [
      { device: 0, duration: 5000 }, // Laptop
      { device: 1, duration: 7000 }, // Phone
      { device: 2, duration: 8000 }, // Matrix
    ];

    let currentIndex = 0;
    
    const nextDevice = () => {
      currentIndex = (currentIndex + 1) % sequence.length;
      setActiveDevice(sequence[currentIndex].device);
      setTimeout(nextDevice, sequence[currentIndex].duration);
    };

    const timer = setTimeout(nextDevice, sequence[currentIndex].duration);
    
    return () => clearTimeout(timer);
  }, []);

  const devices = [
      <Laptop key="laptop" />,
      <Phone key="phone" />,
      <div key="matrix" className="relative w-[280px] h-[180px] sm:w-[320px] sm:h-[210px] md:w-[380px] md:h-[240px] bg-black rounded-lg"><MatrixRain /></div>
  ]

  return (
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
      {devices.map((device, index) => (
          <div
            key={index}
            className={cn(
              "absolute transition-opacity duration-1000",
              activeDevice === index ? "opacity-100 device-fade-in-animation" : "opacity-0"
            )}
          >
              {device}
          </div>
      ))}
    </div>
  );
}
