
'use client';

import { cn } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className={cn("py-4 text-center text-sm z-10 text-muted-foreground bg-background/80 backdrop-blur-lg border-t")}>
      <div className="container">
        <p>
          © 2025 Mono Ai, All rights reserved.
        </p>
      </div>
    </footer>
  );
}
