
'use client';

import * as React from 'react';
import { Moon, Sun, Eclipse, Coffee } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ultra:-rotate-90 ultra:scale-0 macchiato:-rotate-90 macchiato:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ultra:rotate-90 ultra:scale-0 macchiato:rotate-90 macchiato:scale-0" />
          <Eclipse className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:rotate-0 ultra:scale-100 macchiato:rotate-90 macchiato:scale-0" />
          <Coffee className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:rotate-0 macchiato:scale-100" />
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
         <DropdownMenuItem onClick={() => setTheme('ultra')}>
          Ultra
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('macchiato')}>
          Macchiato
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
