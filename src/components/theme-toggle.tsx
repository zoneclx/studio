
'use client';

import * as React from 'react';
import { Moon, Sun, Eclipse, Coffee, Beaker } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Custom Spider icon as an SVG component
const Spider = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v5" />
      <path d="M12 17v5" />
      <path d
="M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
fill="currentColor"
/>
      <path d="M4.93 4.93l3.53 3.53" />
      <path d="M15.54 15.54l3.53 3.53" />
      <path d="M2 12h5" />
      <path d="M17 12h5" />
      <path d="M4.93 19.07l3.53-3.53" />
      <path d="M15.54 8.46l3.53-3.53" />
    </svg>
);


export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ultra:-rotate-90 ultra:scale-0 macchiato:-rotate-90 macchiato:scale-0 glass:-rotate-90 glass:scale-0 spiderman:-rotate-90 spiderman:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ultra:rotate-90 ultra:scale-0 macchiato:rotate-90 macchiato:scale-0 glass:rotate-90 glass:scale-0 spiderman:rotate-90 spiderman:scale-0" />
          <Eclipse className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:rotate-0 ultra:scale-100 macchiato:rotate-90 macchiato:scale-0 glass:rotate-90 glass:scale-0 spiderman:rotate-90 spiderman:scale-0" />
          <Coffee className="absolute h-[1.2rem] w-[12rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:rotate-0 macchiato:scale-100 glass:rotate-90 glass:scale-0 spiderman:rotate-90 spiderman:scale-0" />
           <Beaker className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:scale-0 glass:rotate-0 glass:scale-100 spiderman:rotate-90 spiderman:scale-0" />
           <Spider className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:scale-0 ultra:scale-0 macchiato:scale-0 glass:scale-0 spiderman:rotate-0 spiderman:scale-100" />
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
         <DropdownMenuItem onClick={() => setTheme('glass')}>
          Glass
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('spiderman')}>
          Spider-Man
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
