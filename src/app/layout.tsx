
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/context/theme-context';
import { useSound } from '@/hooks/use-sound';
import { useEffect } from 'react';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontDisplay = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

// export const metadata: Metadata = {
//   title: 'Monochrome Ai',
//   description: 'Generate websites with a single prompt.',
// };

function SoundProvider({ children }: { children: React.ReactNode }) {
  const [playClick] = useSound('/sounds/click.mp3'); // This is a placeholder, zzfx generates the sound

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button')) {
        playClick();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [playClick]);

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>Monochrome Ai</title>
        <meta name="description" content="Generate websites with a single prompt." />
      </head>
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider>
          <SoundProvider>
            <div className="min-h-screen w-full bg-background/80 backdrop-blur-sm">
              <AuthProvider>{children}</AuthProvider>
              <Toaster />
            </div>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
