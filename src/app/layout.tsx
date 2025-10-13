
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider, useTheme } from '@/context/theme-context';
import CookieConsent from '@/components/cookie-consent';
import AnimatedGradient from '@/components/animated-gradient';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontDisplay = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

function ThemedBody({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <body
            className={cn(
                'min-h-screen font-sans antialiased bg-background',
                fontSans.variable,
                fontDisplay.variable
            )}
        >
            <ThemeProvider defaultTheme='ultra'>
                <AnimatedGradient />
                <div className="relative z-10">
                    <AuthProvider>{children}</AuthProvider>
                    <Toaster />
                    <CookieConsent />
                </div>
            </ThemeProvider>
        </body>
    )
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
      <ThemeProvider defaultTheme='ultra'>
          <ThemedBody>{children}</ThemedBody>
      </ThemeProvider>
    </html>
  );
}
