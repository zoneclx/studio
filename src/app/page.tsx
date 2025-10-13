
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Component, MousePointer, Paintbrush, FileCode2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import TypewriterEffect from '@/components/typewriter-effect';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const animatedTitles = [
    "Build a website with a single prompt.",
    "Generate code in seconds.",
    "Your vision, brought to life.",
    "Create a portfolio for a photographer.",
    "Design a landing page for a new app.",
    "Launch a blog for a travel writer.",
];

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div
      className={cn(
        "flex flex-col min-h-screen w-full bg-background text-foreground"
      )}
    >
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-start text-left">
                    <TypewriterEffect
                        texts={animatedTitles}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[150px]"
                    />
                    <p className={cn("text-base sm:text-lg lg:text-xl max-w-xl mb-8 text-muted-foreground")}>
                        Monochrome Ai is a powerful tool that allows you to generate
                        beautiful, production-ready websites using simple text prompts.
                        Describe your vision, and watch as our AI brings it to life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/create">
                        <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
                            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        </Link>
                        {!user && (
                        <Link href="/try">
                            <Button size="lg" variant="outline" className={cn("font-bold text-lg w-full sm:w-auto")}>
                            Try for Free
                            </Button>
                        </Link>
                        )}
                    </div>
                </div>

                <div className="hidden md:block">
                  <Card className="transform-gpu transition-transform duration-500 hover:rotate-[-2deg] hover:shadow-2xl">
                      <CardContent className="p-2">
                          <div className="bg-muted/50 p-4 rounded-lg">
                              <div className="bg-background rounded-md shadow-inner-lg overflow-hidden border">
                                  <div className="h-8 flex items-center justify-between px-3 bg-muted border-b">
                                      <div className="flex items-center gap-1.5">
                                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                      </div>
                                      <div className="text-sm text-muted-foreground font-mono bg-background px-4 py-0.5 rounded-md border">
                                        your-website.com
                                      </div>
                                  </div>
                                  <div className="p-6 text-center animate-pulse">
                                      <FileCode2 className="w-24 h-24 mx-auto text-muted-foreground/20" />
                                      <p className="mt-4 text-muted-foreground">AI is generating your preview...</p>
                                  </div>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                </div>
            </div>
        </section>
      </main>

      <footer className={cn("py-6 text-center text-sm z-10 text-muted-foreground")}>
        <p>
          &copy; 2025 Monochrome Ai, All rights reserved.
        </p>
      </footer>
    </div>
  );
}
