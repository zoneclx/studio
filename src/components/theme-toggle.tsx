
'use client';

import * as React from 'react';
import { Moon, Sun, Eclipse, Coffee, Beaker, Lock, Video } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { useAuth } from '@/context/auth-context';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const handleThemeSelect = (theme: string, isPremium: boolean) => {
    if (isPremium && !user) {
        router.push('/signup');
    } else {
        setTheme(theme as any);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ultra:-rotate-90 ultra:scale-0 macchiato:-rotate-90 macchiato:scale-0 glass:-rotate-90 glass:scale-0 cinematic:-rotate-90 cinematic:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ultra:rotate-90 ultra:scale-0 macchiato:rotate-90 macchiato:scale-0 glass:rotate-90 glass:scale-0 cinematic:rotate-90 cinematic:scale-0" />
          <Eclipse className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:rotate-0 ultra:scale-100 macchiato:rotate-90 macchiato:scale-0 glass:rotate-90 glass:scale-0 cinematic:rotate-90 cinematic:scale-0" />
          <Coffee className="absolute h-[1.2rem] w-[12rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:rotate-0 macchiato:scale-100 glass:rotate-90 glass:scale-0 cinematic:rotate-90 cinematic:scale-0" />
           <Beaker className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:scale-0 glass:rotate-0 glass:scale-100 cinematic:rotate-90 cinematic:scale-0" />
           <Video className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:scale-0 glass:scale-0 cinematic:rotate-0 cinematic:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeSelect('light', false)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeSelect('dark', false)}>
          Dark
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => handleThemeSelect('ultra', false)}>
          Ultra
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeSelect('macchiato', false)}>
          Macchiato
        </DropdownMenuItem>
         <DropdownMenuItem
          onClick={() => handleThemeSelect('glass', true)}
          disabled={!user}
          className={cn({"flex justify-between items-center": !user})}
        >
          Glass
          {!user && <Lock className="h-3 w-3" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeSelect('cinematic', true)}
          disabled={!user}
           className={cn({"flex justify-between items-center": !user})}
        >
          Cinematic
          {!user && <Lock className="h-3 w-3" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeSelect('system', false)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
