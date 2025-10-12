'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Code, LogOut, PenTool, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'You have successfully signed out.',
      });
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
        {loading ? null : user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : null}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4">
          Build Websites with a Prompt
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-8">
          Welcome to Monochrome Ai, your intelligent partner for web development.
          Describe your vision, and let our AI bring it to life instantly.
        </p>
        <Link href="/create">
          <Button size="lg" className="font-bold text-lg">
            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
         <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold font-display">How It Works</h3>
            <p className="text-muted-foreground mt-2">A simple two-step process to your new website.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <PenTool className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>1. Describe Your Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start with a simple description of the website you want to create.
                Whether it's a portfolio, a blog, or a landing page, just
                tell us what you need.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>2. Get Instant Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI generates clean, ready-to-use HTML and Tailwind CSS code.
                You can preview it live and download the file to use right away.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Monochrome Ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
