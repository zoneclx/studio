
'use client';

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, var(--breathing-glow) 0%, transparent 70%)',
          animation: 'breathing-glow 10s ease-in-out infinite',
        }}
      />
    </div>
  );
}
