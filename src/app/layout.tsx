
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/context/theme-context';
import CookieConsent from '@/components/cookie-consent';
import AnimatedGradient from '@/components/animated-gradient';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppNav from '@/components/app-nav';
import Header from '@/components/header';

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
        <title>Monochrome Ai</title>
        <meta name="description" content="Generate websites with a single prompt." />
      </head>
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-muted/30',
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider defaultTheme='dark'>
            <AuthProvider>
              <SidebarProvider>
                <div className="flex min-h-screen">
                  <SidebarInset className="flex-1 flex flex-col">
                      <AnimatedGradient />
                      <Header />
                      <main className="flex-1 relative z-10">
                        {children}
                      </main>
                      <Toaster />
                      <CookieConsent />
                  </SidebarInset>
                  <AppNav />
                </div>
              </SidebarProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

    