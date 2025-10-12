'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4">
          Build a website with a single prompt
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-8">
          Monochrome AI is a powerful tool that allows you to generate
          beautiful, production-ready websites using simple text prompts.
          Describe your vision, and watch as our AI brings it to life, helping
          you refine and perfect your creation.
        </p>
        <Link href="/signup">
          <Button size="lg" className="font-bold text-lg">
            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="relative">
          <Image
            src="https://picsum.photos/seed/main-hero/1200/600"
            alt="Abstract website builder interface"
            width={1200}
            height={600}
            data-ai-hint="abstract interface"
            className="w-full rounded-lg shadow-2xl"
          />
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Monochrome Ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
