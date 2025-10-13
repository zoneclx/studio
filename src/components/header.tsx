'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, User, ArrowLeft } from 'lucide-react';
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
import { ThemeToggle } from '@/components/theme-toggle';

type HeaderProps = {
  showBackToHome?: boolean;
};

export default function Header({ showBackToHome = false }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {showBackToHome && (
           <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        )}
         <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
      </div>
      <nav className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
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
              <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}
