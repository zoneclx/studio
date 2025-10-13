
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, User, Menu, Settings } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { Separator } from './ui/separator';
import { Home, Bot, FileArchive, MessageSquare } from 'lucide-react';

export default function Header() {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

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
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} alt={user.name} />
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
                  {user.name || user.email}
                </p>
                 {user.name && <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
              <Link href="/profile" onClick={handleLinkClick}>
                <Settings className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/my-work" onClick={handleLinkClick}>
                <FileArchive className="mr-2 h-4 w-4" />
                My Archive
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/chat" onClick={handleLinkClick}>
                 <MessageSquare className="mr-2 h-4 w-4" />
                AI Chat
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/create" onClick={handleLinkClick}>
                 <Bot className="mr-2 h-4 w-4" />
                Builder
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              signOut();
              handleLinkClick();
            }}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/signup" onClick={handleLinkClick}>
          <Button>Sign Up</Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center z-20 bg-transparent">
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
            <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 p-4 pt-8 h-full">
              <div className="flex flex-col gap-2 flex-1">
                <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                {user && (
                    <>
                        <Link href="/profile" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                            <Settings className="h-5 w-5" />
                            Profile
                        </Link>
                        <Link href="/chat" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                           <MessageSquare className="h-5 w-5" />
                            AI Chat
                        </Link>
                        <Link href="/create" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                            <Bot className="h-5 w-5" />
                            Builder
                        </Link>
                        <Link href="/my-work" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                           <FileArchive className="h-5 w-5" />
                            My Archive
                        </Link>
                    </>
                )}
                {!user && (
                   <>
                    <Link href="/chat" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                        <MessageSquare className="h-5 w-5" />
                        AI Chat
                    </Link>
                    <Link href="/try" onClick={handleLinkClick} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                          <Bot className="h-5 w-5" />
                          Try for Free
                      </Link>
                   </>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                 <NavContent />
              </div>
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
