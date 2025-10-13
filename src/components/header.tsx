
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, User, Menu, Settings, LogOut } from 'lucide-react';
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
import { Home, Bot, FileArchive, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/theme-context';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSheetOpen(false);
    }
  };

  const navLinks = [
    { href: '/create', label: 'Builder', icon: Bot, auth: true },
    { href: '/chat', label: 'AI Chat', icon: MessageSquare, auth: false, badge: 'Free' },
    { href: '/my-work', label: 'My Archive', icon: FileArchive, auth: true },
  ];

  const NavLink = ({ href, label, icon: Icon, badge, onClick }: { href: string; label: string; icon: React.ElementType, badge?: string, onClick: () => void; }) => {
    const isActive = pathname === href;
    return (
        <Link href={href} onClick={onClick}>
            <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                 <Icon className="h-5 w-5" />
                 <span>{label}</span>
                 {badge && <Badge variant="destructive" className="h-5">{badge}</Badge>}
            </Button>
        </Link>
    );
  };
  
  const DesktopNavLinks = () => (
     <div className="hidden md:flex items-center gap-2">
        {navLinks.filter(link => user || !link.auth).map(link => (
          <Link key={link.href} href={link.href} passHref>
             <Button variant={pathname === link.href ? "secondary" : "ghost"} className="flex gap-2">
              {link.label}
              {link.badge && <Badge variant="destructive">{link.badge}</Badge>}
            </Button>
          </Link>
        ))}
     </div>
  );

  const UserMenu = () => (
    <>
      <ThemeToggle />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border">
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { signOut(); handleLinkClick(); }}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
         <div className="flex items-center gap-2">
            <Link href="/login" passHref>
                <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup" onClick={handleLinkClick}>
                <Button>Sign Up</Button>
            </Link>
         </div>
      )}
    </>
  );

  return (
    <header className={cn("container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center z-20 bg-transparent sticky top-0 bg-background/80 backdrop-blur-lg border-b", {
        'glass-effect': theme === 'glass'
    })}>
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
        <DesktopNavLinks />
      </div>

      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col p-4">
             <SheetHeader className="text-left mb-4">
                <SheetTitle className="text-xl font-bold font-display flex items-center gap-2">
                    <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Monochrome Ai
                    </Link>
                </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 flex-1">
                 <NavLink href="/" label="Home" icon={Home} onClick={handleLinkClick} />
                 {navLinks.filter(link => user || !link.auth).map(link => (
                    <NavLink key={link.href} href={link.href} label={link.label} icon={link.icon} badge={link.badge} onClick={handleLinkClick} />
                 ))}
                 {!user && <NavLink href="/demo" label="Demo for Free" icon={Bot} onClick={handleLinkClick} />}
            </nav>
            <div className="flex items-center justify-between mt-4">
              <UserMenu />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      )}
    </header>
  );
}

    