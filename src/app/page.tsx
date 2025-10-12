'use client';

import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Code, LogOut, PenTool, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseApp } from '@/firebase';

export default function Home() {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const app = useFirebaseApp();
  const auth = getAuth(app);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Monochrome Ai
        </h1>
        {loading ? null : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-5xl sm:text-7xl font-bold font-display tracking-tight mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          Build Websites with a Prompt
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
          Welcome to Monochrome Ai, your intelligent partner for web development.
          Describe your vision, and let our AI bring it to life instantly.
        </p>
        <Link href="/create">
          <Button size="lg" disabled={!user && !loading} className="font-bold text-lg">
            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        {!user && !loading && (
          <p className="text-sm text-muted-foreground mt-4">
            Please sign in to start creating.
          </p>
        )}
      </main>

      <section className="container mx-auto px-4 py-24">
         <div className="text-center mb-12">
            <h3 className="text-4xl font-bold font-display">How It Works</h3>
            <p className="text-muted-foreground mt-2">A simple three-step process to your new website.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
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
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
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
