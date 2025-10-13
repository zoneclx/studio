
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import TypewriterEffect from '@/components/typewriter-effect';
import Header from '@/components/header';
import Image from 'next/image';

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
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="relative flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
        <Image
            src="https://images.unsplash.com/photo-1532696190439-5641f3f33b14?q=80&w=2070&auto=format&fit=crop"
            alt="Moon in the night sky"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-30"
            priority
        />
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="relative z-10">
          <TypewriterEffect
              texts={animatedTitles}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4 min-h-[80px] sm:min-h-[140px] lg:min-h-[168px]"
          />
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-8">
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
                <Button size="lg" variant="outline" className="font-bold text-lg w-full sm:w-auto">
                  Try for Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground z-10">
        <p>
          &copy; 2025 Enzo Gimena's Ai, All rights reserved.
        </p>
      </footer>
    </div>
  );
}
