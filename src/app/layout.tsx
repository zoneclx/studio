
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Byte AI</title>
        <meta name="description" content="Generate websites with a single prompt." />
      </head>
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-background',
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <AuthProvider>
                <AnimatedGradient />
                <main className="relative z-10">
                  {children}
                </main>
                <Toaster />
                <CookieConsent />
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
