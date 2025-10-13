'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, User, Menu, X } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const NavContent = () => (
    <>
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
              <Link href="/my-work" onClick={() => isMobile && setIsSheetOpen(false)}>My Archive</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/create" onClick={() => isMobile && setIsSheetOpen(false)}>Builder</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              signOut();
              if (isMobile) setIsSheetOpen(false);
            }}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/signup" onClick={() => isMobile && setIsSheetOpen(false)}>
          <Button>Sign Up</Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
      </div>
      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-6 p-4 pt-16">
               <NavContent />
                {user && (
                    <div className="flex flex-col gap-4 pt-4 border-t border-border">
                        <Link href="/create" className="text-lg" onClick={() => setIsSheetOpen(false)}>Builder</Link>
                    </div>
                )}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex items-center gap-4">
          <NavContent />
        </nav>
      )}
    </header>
  );
}
