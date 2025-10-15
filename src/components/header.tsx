
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileArchive, User, LogOut, Sparkles, Moon, Sun, Menu } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
  { href: '/create', label: 'AI Chat', icon: Bot, auth: true },
];

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserNav() {
    const { user, signOut } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                 <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || user.email.split('@')[0]}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function MainNav({ className }: { className?: string }) {
    const pathname = usePathname();
    const { user } = useAuth();
    return (
        <nav className={cn("hidden md:flex items-center gap-4 text-sm font-medium", className)}>
            {navLinks.filter(l => !l.auth || user).map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}

function MobileNav() {
    const { user, signOut } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] p-0">
                    <div className="flex flex-col h-full">
                         <div className="p-4 border-b">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                                <Sparkles className="h-6 w-6 text-primary" />
                                <span className="font-bold">Byte AI</span>
                            </Link>
                        </div>
                        <nav className="flex flex-col gap-4 p-4 text-lg font-medium">
                           {navLinks.filter(l => !l.auth || user).map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto p-4 border-t">
                            {user ? (
                                <div className="space-y-4">
                                     <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/profile" onClick={() => setOpen(false)}>Profile</Link>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setOpen(false); }}>
                                        Log Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Button className="w-full" asChild>
                                        <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-bold">Byte AI</span>
            </Link>
            <MainNav />
            <div className="flex flex-1 items-center justify-end space-x-2">
                <ThemeToggle />
                <div className="hidden md:block">
                    <UserNav />
                </div>
                <MobileNav />
            </div>
        </div>
    </header>
  );
}
