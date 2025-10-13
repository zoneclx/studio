
'use client';

import { cn } from "@/lib/utils";

export default function AnimatedBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}>
      <div
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, var(--breathing-glow) 0%, transparent 70%)',
          animation: 'breathing-glow 10s ease-in-out infinite',
        }}
      />
    </div>
  );
}
