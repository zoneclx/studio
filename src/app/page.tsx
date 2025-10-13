
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Component, MousePointer, Paintbrush, FileCode2, Sparkles, Eye, Download, Wand2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import TypewriterEffect from '@/components/typewriter-effect';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const animatedTitles = [
    "Build a website with a single prompt.",
    "Generate code in seconds.",
    "Your vision, brought to life.",
    "Create a portfolio for a photographer.",
    "Design a landing page for a new app.",
    "Launch a blog for a travel writer.",
];

const features = [
    {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "AI-Powered Generation",
        description: "Just describe your ideal website. Our AI will understand your vision and generate the complete HTML and Tailwind CSS code for you in seconds.",
    },
    {
        icon: <Eye className="w-8 h-8 text-primary" />,
        title: "Live Preview",
        description: "Watch your website come to life in real-time. The preview panel instantly renders the code as it's generated, giving you immediate feedback.",
    },
    {
        icon: <Download className="w-8 h-8 text-primary" />,
        title: "Full Code Export",
        description: "You have complete ownership. Download the generated HTML file with a single click and host it on any platform you choose, no strings attached.",
    },
    {
        icon: <Wand2 className="w-8 h-8 text-primary" />,
        title: "Easy Customization",
        description: "Refine your design by chatting with our AI assistant. Ask for changes, and the AI will intelligently update the code to match your request.",
    },
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

        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold font-display">Why Choose Monochrome AI?</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We combine cutting-edge AI with a user-friendly interface to make web development accessible to everyone.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                            <CardHeader>
                                {feature.icon}
                                <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
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
