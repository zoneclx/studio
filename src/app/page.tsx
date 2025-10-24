
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Terminal, Share2, Sparkles, Server, GitBranch, MessageSquare, User } from 'lucide-react';
import HackerEffect from '@/components/hacker-effect';
import TypewriterEffect from '@/components/typewriter-effect';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import AnimatedDevices from '@/components/animated-devices';

const animatedTitles = [
    "Build a website with a single prompt.",
    "AI-powered website generation.",
    "The Future of Web Creation is Here.",
    "Your Collaborative Coding Sandbox.",
    "Design, Code, and Collaborate.",
];

const redhatTitles = [
    "Initializing virtual DOM...",
    "Compiling TypeScript to Assembly...",
    "Spinning up cloud instance...",
    "Deploying to the edge network...",
    "Synchronizing with Git repository...",
    "Hot-reloading module: /app/page.tsx...",
    "Welcome to your Cloud IDE.",
    "Bootstrapping Next.js server...",
    "Establishing secure development tunnel...",
    "Running Lighthouse performance audit...",
    "Minifying JavaScript bundle...",
    "Pruning node_modules tree...",
    "Authenticating via SSH key...",
    "Just-In-Time compilation engaged.",
    "Rendering server components...",
    "Connecting to live-share session...",
    "Type 'help' for a list of commands.",
    "Your environment is ready.",
    "Fetching dependencies from cache...",
    "Warming up serverless functions...",
    "Optimizing asset delivery...",
    "Welcome to Byte Studio.",
];

const features = [
    {
        icon: <Code className="w-8 h-8 text-primary" />,
        title: "Full-Featured Editor",
        description: "Refine your code with a complete in-browser editor, featuring a file explorer, live preview, and integrated terminal.",
    },
    {
        icon: <Server className="w-8 h-8 text-primary" />,
        title: "Powered by Firebase",
        description: "Built on a secure and scalable backend with Firebase Authentication and Firestore for a seamless experience.",
    },
    {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "AI-Assisted Features",
        description: "Leverage AI to generate code, get suggestions, and accelerate your development workflow. (Currently under development).",
    },
];

const EditorIcon = () => (
    <Terminal className="w-8 h-8 text-primary" />
);

export default function HomePage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderTextEffect = () => {
        const effectContainerClass = "text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight mb-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[150px] break-words";
        
        if (!mounted) {
            return <div className={effectContainerClass} />;
        }
        if (theme === 'redhat') {
            return (
                <div className={cn(effectContainerClass, 'text-foreground')}>
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
                    <p className={cn("text-base sm:text-lg lg:text-xl max-w-xl mb-4 text-muted-foreground")}>
                        Byte Studio is a powerful, browser-based development environment.
                        Write, test, and collaborate on your next great project without ever leaving your browser.
                    </p>
                    <p className="text-sm max-w-xl mb-8 text-muted-foreground/80">
                        Created by Shawn Enzo J. Gimena, a passionate high school student developer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/dashboard">
                        <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
                            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        </Link>
                    </div>
                </div>

                <div className="z-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <AnimatedDevices />
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-3xl sm:text-4xl font-bold font-display">A New Way to Build Software</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We combine a powerful editor with collaborative tools to make complex tasks simple.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <Badge variant="outline" className="text-sm">Powered by Next.js & Firebase</Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4">Pioneering the Future of Web Development</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Byte Studio leverages state-of-the-art web technologies to turn your ideas into reality. Our platform provides a robust, scalable, and powerful environment for instant development and deployment.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
                    <Card className="bg-card/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-8 h-8 text-primary" />
                                <h3 className="text-2xl font-display">About Byte Studio</h3>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Byte Studio is more than just a tool; it's your creative partner. Our mission is to democratize access to powerful development tools, making it easy for anyone to build, test, and deploy applications without needing a complex local setup. We believe in the power of ideas, and our platform is built to get you from concept to production in minutes.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <EditorIcon />
                                <h3 className="text-2xl font-display">Cloud-First Development</h3>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                By harnessing the power of modern web frameworks and cloud infrastructure, we provide an editor that is fast, reliable, and accessible from anywhere. This collaboration ensures that our users benefit from cutting-edge technology.
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

    
