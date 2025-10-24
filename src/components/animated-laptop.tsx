
'use client';

export default function AnimatedLaptop() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center">
      <div className="laptop-animation w-full max-w-2xl aspect-[4/3] origin-bottom" style={{ transformStyle: 'preserve-3d' }}>
        {/* Screen */}
        <div className="w-full h-full bg-gray-800 dark:bg-gray-900 rounded-t-lg border-4 border-gray-700 dark:border-gray-800 p-2 transform-origin-bottom">
          <div className="w-full h-full bg-black rounded-sm overflow-hidden relative screen-animation">
            {/* Header */}
            <div className="h-8 flex items-center justify-between px-3 bg-gray-800/80">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-gray-400 font-mono bg-gray-900/50 px-4 py-0.5 rounded-md border border-gray-700">
                app.js
              </div>
            </div>
            {/* Code */}
            <div className="p-4 font-mono text-xs sm:text-sm text-gray-300">
              <p className="typing-animation">
                <span className="text-purple-400">const</span> <span className="text-green-300">App</span> = () =&gt; ( ... );
              </p>
            </div>
          </div>
        </div>
        {/* Base */}
        <div className="absolute bottom-0 w-full h-2 bg-gray-700 dark:bg-gray-800 rounded-b-lg transform translate-y-full" />
        <div className="absolute bottom-0 w-[110%] left-[-5%] h-4 bg-gradient-to-t from-gray-800 to-gray-700 dark:from-gray-900 dark:to-gray-800 rounded-b-xl transform translate-y-full" style={{ transform: 'perspective(100px) rotateX(-20deg)' }} />
      </div>
    </div>
  );
}
