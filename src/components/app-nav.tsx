
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileArchive, User, Settings, LogOut, Sparkles, Moon, Sun } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
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
import { useSidebar } from '@/components/ui/sidebar';

const navLinks = [
  { href: '/create', label: 'Builder', icon: Bot, auth: true },
  { href: '/my-work', label: 'My Archive', icon: FileArchive, auth: true },
];

const themes = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'System', value: 'system' },
    { name: 'Rose', value: 'rose' },
    { name: 'Violet', value: 'violet' },
    { name: 'Macchiato', value: 'macchiato' },
    { name: 'Glass', value: 'glass' },
    { name: 'Red Hat', value: 'redhat' },
    { name: 'Ultra', value: 'ultra' },
    { name: 'Material', value: 'material' },
];

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-full group-data-[collapsible=icon]:w-10">
            <div className="flex items-center gap-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="group-data-[collapsible=icon]:hidden">Themes</span>
                <span className="sr-only">Toggle theme</span>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="end" className="w-40">
        {themes.map(theme => (
            <DropdownMenuItem key={theme.value} onClick={() => setTheme(theme.value as any)}>
                {theme.name}
            </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function AppNav() {
  const { user, signOut } = useAuth();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };
  
  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="p-2 flex items-center justify-between">
         <h1 className="text-xl font-bold font-display flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                <Sparkles className="w-6 h-6 text-primary" />
                <span>Monochrome</span>
            </Link>
        </h1>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navLinks
            .filter((link) => user || !link.auth)
            .map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(link.href)}
                    tooltip={{ children: link.label, side: 'left' }}
                    onClick={handleLinkClick}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="flex items-center justify-between w-full">
                      {link.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 flex flex-col gap-2">
         <ThemeToggle />
         {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-full justify-start gap-2 px-2">
                   <Avatar className="h-8 w-8 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                        <User />
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium leading-none truncate">{user.name || user.email}</p>
                        {user.name && <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>}
                    </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" side="left" align="start" forceMount>
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
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         ) : (
            <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
                <Link href="/try">
                  <Button className="w-full">Try for Free</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">Sign Up</Button>
                </Link>
            </div>
         )}
      </SidebarFooter>
    </Sidebar>
  );
}
