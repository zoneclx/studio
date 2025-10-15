
'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:h-16 sm:px-6">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger />}
        <h1 className="text-lg font-bold font-display flex items-center gap-2 sm:text-xl">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
      </div>
    </header>
  );
}
