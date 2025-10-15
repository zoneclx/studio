
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, Wand2, Sparkles, LayoutTemplate } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import TypewriterEffect from '@/components/typewriter-effect';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const animatedTitles = [
    "Build a website with a single prompt.",
    "Your vision, brought to life.",
    "From idea to website in seconds.",
    "AI-powered website generation.",
    "Create, customize, and deploy.",
    "The future of web design is here."
];

const features = [
    {
        icon: <Wand2 className="w-8 h-8 text-primary" />,
        title: "AI-Powered Generation",
        description: "Describe your ideal website, and our AI will generate the initial design and code, giving you a running start.",
        badge: "Soon"
    },
    {
        icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
        title: "Full Customization",
        description: "Tweak the generated code, adjust styles, and make the website truly your own with a powerful built-in editor.",
         badge: "Soon"
    },
     {
        icon: <Eye className="w-8 h-8 text-primary" />,
        title: "Live Preview",
        description: "Instantly see your changes reflected in a live preview. Iterate quickly and design with confidence.",
         badge: "Soon"
    },
    {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "Free to Start",
        description: "Experiment and build your first website for free. Sign up to save your work and unlock more features.",
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
      <main className="flex-1">
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
            <Image
                src="https://i.ibb.co/yYc8dG8/mars-surface.jpg"
                alt="Mars background"
                fill
                objectFit="cover"
                quality={90}
                className="absolute inset-0 -z-10 opacity-40"
                data-ai-hint="mars planet"
            />
            <div className="absolute inset-0 -z-20 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-start text-left z-10">
                    <TypewriterEffect
                        texts={animatedTitles}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[150px]"
                    />
                    <p className={cn("text-base sm:text-lg lg:text-xl max-w-xl mb-8 text-muted-foreground")}>
                        Monochrome Ai is a powerful, AI-powered website builder.
                        Describe your vision, and watch as our AI brings it to life in seconds.
                        The future of creation is here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/create">
                        <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
                            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        </Link>
                        {!user && (
                        <Link href="/signup">
                            <Button size="lg" variant="outline" className={cn("font-bold text-lg w-full sm:w-auto")}>
                            Sign Up
                            </Button>
                        </Link>
                        )}
                    </div>
                </div>

                <div className="hidden md:block z-10">
                  <Card className="transform-gpu transition-transform duration-500 hover:rotate-[-2deg] hover:shadow-2xl bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-2">
                          <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="bg-background/80 rounded-md shadow-inner-lg overflow-hidden border">
                                  <div className="h-8 flex items-center justify-between px-3 bg-muted/50 border-b">
                                      <div className="flex items-center gap-1.5">
                                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                      </div>
                                      <div className="text-sm text-muted-foreground font-mono bg-background px-4 py-0.5 rounded-md border">
                                        website-builder
                                      </div>
                                  </div>
                                  <div className="p-6 text-left space-y-4">
                                      <div className="flex items-start gap-2">
                                          <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0"></div>
                                          <div className="w-3/4 h-5 bg-muted rounded-md animate-pulse"></div>
                                      </div>
                                       <div className="flex items-start gap-2 justify-end">
                                          <div className="w-2/3 h-5 bg-primary/20 rounded-md animate-pulse"></div>
                                          <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0"></div>
                                      </div>
                                       <div className="flex items-start gap-2">
                                          <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0"></div>
                                          <div className="w-1/2 h-5 bg-muted rounded-md animate-pulse"></div>
                                      </div>
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
                    <h2 className="text-3xl sm:text-4xl font-bold font-display">The Future of Building Websites</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We combine a powerful AI model with a user-friendly interface to make web development accessible to everyone.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                            <CardHeader>
                                {feature.icon}
                                 <CardTitle className="mt-4 text-xl flex items-center gap-2">
                                    {feature.title}
                                    {feature.badge && <Badge variant={feature.badge === 'Soon' ? 'default' : 'destructive'}>{feature.badge}</Badge>}
                                </CardTitle>
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

      <footer className={cn("py-6 text-center text-sm z-10 text-muted-foreground bg-background")}>
        <p>
          © 2025 Enzo Gimena's Ai, All rights reserved.
        </p>
      </footer>
    </div>
  );
}
