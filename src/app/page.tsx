'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import TypewriterEffect from '@/components/typewriter-effect';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
        <nav className="flex items-center gap-4">
           <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-work">My Archive</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/create">Builder</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
        <TypewriterEffect
            text="Build a website with a single prompt"
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
          <Link href="/try">
            <Button size="lg" variant="outline" className="font-bold text-lg w-full sm:w-auto">
              Try for Free
            </Button>
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; 2025 Enzo Gimena's Ai, All rights reserved.
        </p>
      </footer>
    </div>
  );
}
