
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wand2, Sparkles, Image as ImageIcon, Bot, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import TypewriterEffect from '@/components/typewriter-effect';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const animatedTitles = [
    "Chat with a powerful AI assistant.",
    "Your vision, understood by AI.",
    "From idea to answer in seconds.",
    "AI-powered conversations.",
    "Ask, analyze, and create with ease.",
    "The future of chat is here."
];

const features = [
    {
        icon: <MessageSquare className="w-8 h-8 text-primary" />,
        title: "Conversational AI",
        description: "Engage in natural, helpful conversations. Ask questions, get explanations, and brainstorm ideas with a friendly AI.",
    },
    {
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        title: "Image Understanding",
        description: "Upload an image and ask questions about it. Byte AI can analyze visual information to provide context-aware answers.",
    },
     {
        icon: <Wand2 className="w-8 h-8 text-primary" />,
        title: "Instant Responses",
        description: "Get immediate replies to your queries, powered by state-of-the-art language models for a seamless experience.",
    },
    {
        icon: <Sparkles className="w-8 h-8 text-primary" />,
        title: "Free to Start",
        description: "Experiment with the AI on our trial page. Sign up to unlock the full potential and save your conversations.",
    },
];

const AiIcon = () => (
    <Bot className="w-8 h-8 text-primary" />
);


export default function Home() {
  const { user } = useAuth();
  
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
                    <TypewriterEffect
                        texts={animatedTitles}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[150px]"
                    />
                    <p className={cn("text-base sm:text-lg lg:text-xl max-w-xl mb-8 text-muted-foreground")}>
                        Byte AI is a powerful, AI-powered chat assistant.
                        Describe your vision, upload an image, and watch as our AI brings it to life.
                        The future of creation is here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/create">
                        <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
                            Start Chatting <ArrowRight className="ml-2 h-5 w-5" />
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
                                        chat.tsx
                                      </div>
                                  </div>
                                  <div className="p-6 text-left space-y-2 font-mono text-xs text-muted-foreground">
                                      <p><span className="text-purple-400">const</span> <span className="text-green-300">User</span>: <span className="text-yellow-300">"What do you see?"</span></p>
                                      <p><span className="text-purple-400">const</span> <span className="text-green-300">ByteAI</span>: <span className="text-yellow-300">"I see..."</span></p>
                                      <div className="w-full h-4 bg-muted rounded-full animate-pulse my-2"></div>
                                      <div className="w-3/4 h-4 bg-muted rounded-full animate-pulse"></div>
                                      <p>&lt;/<span className="text-blue-400">div</span>&gt;</p>
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
                    <h2 className="text-3xl sm:text-4xl font-bold font-display">A New Way to Interact with AI</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We combine a powerful AI model with an intuitive interface to make complex tasks simple.
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
                    <Badge variant="outline" className="text-sm">Powered by Google AI</Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold font-display mt-4">Pioneering the Future of AI Interaction</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Byte AI leverages state-of-the-art generative artificial intelligence to turn your ideas into reality. Our partnership with Google AI allows us to provide a robust, scalable, and powerful platform for instant answers.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                    <Card className="bg-card/50 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-8 h-8 text-primary" />
                                <h3 className="text-2xl font-display">About Byte AI</h3>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Byte AI is more than just a tool; it's your creative partner. Our mission is to democratize access to powerful AI, making it easy for anyone to get answers, analyze images, and bring ideas to life without needing to be an expert. We believe in the power of curiosity, and our platform is built to get you from question to insight in minutes.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <AiIcon />
                                <h3 className="text-2xl font-display">Partnership with Google AI</h3>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                By harnessing the power of Google's advanced generative models, we can interpret complex questions and analyze images to provide insightful and accurate responses. This collaboration ensures that our users benefit from cutting-edge AI technology, resulting in higher quality answers and a seamless creative process.
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
