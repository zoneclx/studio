
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Terminal, Share2, Sparkles, Server, GitBranch } from 'lucide-react';
import HackerEffect from '@/components/hacker-effect';
import TypewriterEffect from '@/components/typewriter-effect';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const animatedTitles = [
    "Your Development Environment in the Cloud.",
    "Code, Collaborate, and Deploy.",
    "From Idea to Deployment in Seconds.",
    "The Future of Web Development.",
    "Build Anything, Anywhere.",
];

const redhatTitles = [
    "Unlock the Mainframe.",
    "Bypass Security Protocols.",
    "Initiate Code Injection.",
    "Accessing the Grid.",
    "Welcome, Shadow Coder.",
];

const features = [
    {
        icon: <Code className="w-8 h-8 text-primary" />,
        title: "Full-Featured Editor",
        description: "Enjoy a complete coding environment with syntax highlighting, file explorer, and live preview, right in your browser.",
    },
    {
        icon: <GitBranch className="w-8 h-8 text-primary" />,
        title: "Version Control",
        description: "Simulated version control allows you to save, track changes, and manage your projects with ease.",
    },
     {
        icon: <Share2 className="w-8 h-8 text-primary" />,
        title: "Instant Sharing",
        description: "Share your projects with a single click. Collaborate with others or showcase your work effortlessly.",
    },
    {
        icon: <Server className="w-8 h-8 text-primary" />,
        title: "Free to Start",
        description: "Experiment with the editor on our trial page. Sign up to unlock the full potential and save your projects.",
    },
];

const EditorIcon = () => (
    <Terminal className="w-8 h-8 text-primary" />
);

export default function Home() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderTextEffect = () => {
        const effectContainerClass = "text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight mb-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[150px]";
        
        if (!mounted) {
            return <div className={effectContainerClass} />;
        }
        if (theme === 'redhat') {
            return (
                <div className={effectContainerClass}>
                    <HackerEffect
                        texts={redhatTitles}
                    />
                </div>
            );
        }
        return (
             <div className={effectContainerClass}>
                <TypewriterEffect
                    texts={animatedTitles}
                />
            </div>
        );
    }

  return (
    <div
      className={cn(
        "flex flex-col flex-1 w-full bg-background text-foreground"
      )}
    >
      <main className="flex-1">
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden pt-32">
            <div className="absolute inset-0 -z-20 animated-gradient-background opacity-20 dark:opacity-30"></div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-start text-left z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {renderTextEffect()}
                    <p className={cn("text-base sm:text-lg lg:text-xl max-w-xl mb-8 text-muted-foreground")}>
                        Mono Studio is a powerful, browser-based development environment.
                        Code, build, and deploy your next great idea without ever leaving your browser.
                        The future of development is here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/create">
                        <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
                            Start Coding <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        </Link>
                    </div>
                </div>

                <div className="z-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
                                        app.js
                                      </div>
                                  </div>
                                  <div className="p-6 text-left space-y-2 font-mono text-xs text-muted-foreground">
                                      <p><span className="text-blue-400">import</span> React <span className="text-blue-400">from</span> <span className="text-yellow-300">'react'</span>;</p>
                                      <p><span className="text-purple-400">const</span> <span className="text-green-300">App</span> = () => (</p>
                                      <div className="w-full h-4 bg-muted rounded-full animate-pulse my-2 ml-4"></div>
                                      <p>);</p>
                                      <p><span className="text-blue-400">export default</span> App;</p>
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
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-3xl sm:text-4xl font-bold font-display">A New Way to Build Software</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We combine a powerful editor with an intuitive interface to make complex tasks simple.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.3}s` }}>
                            <Card className="h-full text-center bg-card/80 border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                                <CardHeader className="items-center">
                                    {feature.icon}
                                    <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <Badge variant="outline" className="text-sm">Powered by Next.js & Vercel</Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4">Pioneering the Future of Web Development</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Mono Studio leverages state-of-the-art web technologies to turn your ideas into reality. Our platform provides a robust, scalable, and powerful environment for instant development and deployment.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                    <Card className="bg-card/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-8 h-8 text-primary" />
                                <h3 className="text-2xl font-display">About Mono Studio</h3>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Mono Studio is more than just a tool; it's your creative partner. Our mission is to democratize access to powerful development tools, making it easy for anyone to build, test, and deploy applications without needing a complex local setup. We believe in the power of ideas, and our platform is built to get you from concept to production in minutes.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <EditorIcon />
                                <h3 className="text-2xl font-display">Cloud-First Development</h3>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                By harnessing the power of modern web frameworks and cloud infrastructure, we provide an editor that is fast, reliable, and accessible from anywhere. This collaboration ensures that our users benefit from cutting-edge technology, resulting in a faster development cycle and a seamless creative process.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

    

    