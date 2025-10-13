
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import TypewriterEffect from '@/components/typewriter-effect';
import Header from '@/components/header';
import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const animatedTitles = [
    "Build a website with a single prompt.",
    "Generate code in seconds.",
    "Your vision, brought to life.",
    "Create a portfolio for a photographer.",
    "Design a landing page for a new app.",
    "Launch a blog for a travel writer.",
    "Set up an e-commerce store for jewelry.",
    "Build a website for a local bakery.",
    "Create a homepage for a startup.",
    "Design a personal resume site.",
    "Generate a site for a marketing agency.",
    "Build a booking page for a consultant.",
    "Create a gallery for an artist.",
    "Design a site for a fitness instructor.",
    "Launch a page for a podcast.",
    "Set up a menu for a restaurant.",
    "Build a community forum.",
    "Create a real estate listing page.",
    "Design an event invitation site.",
    "Generate a portfolio for a developer.",
    "Build a site for a non-profit.",
    "Create a personal blog.",
    "Design a landing page for a course."
];

export default function Home() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(theme === 'dark' || (theme === 'system' && isSystemDark));
    };

    checkTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    return () => mediaQuery.removeEventListener('change', checkTheme);
  }, [theme]);
  
  const bgImage = "https://i.ibb.co/b3bzC8B/cosmic-deep-space-with-nebula-and-stardust-in-universe-generated-by-ai.jpg";

  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-cover bg-center bg-no-repeat',
        !isDark && 'bg-white'
      )}
      style={isDark ? { backgroundImage: `url('${bgImage}')` } : {}}
    >
      <div className={cn("absolute inset-0 z-0", isDark ? "bg-black/50" : "bg-white/0")}></div>

      <div className={cn("relative z-10 flex flex-col min-h-screen", isDark ? 'text-white' : 'text-foreground')}>
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
            <TypewriterEffect
                texts={animatedTitles}
                className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4 min-h-[80px] sm:min-h-[140px] lg:min-h-[168px]"
            />
            <p className={cn("text-base sm:text-lg lg:text-xl max-w-2xl mb-8", isDark ? 'text-white/80' : 'text-muted-foreground')}>
              Monochrome AI is a powerful tool that allows you to generate
              beautiful, production-ready websites using simple text prompts.
              Describe your vision, and watch as our AI brings it to life, helping
              you refine and perfect your creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
                  Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link href="/try">
                  <Button size="lg" variant="outline" className={cn("font-bold text-lg w-full sm:w-auto", isDark && "dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black")}>
                    Try for Free
                  </Button>
                </Link>
              )}
            </div>
        </main>

        <footer className={cn("py-6 text-center text-sm z-10", isDark ? 'text-white/70' : 'text-muted-foreground')}>
          <p>
            &copy; 2025 Enzo Gimena's Ai, All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
