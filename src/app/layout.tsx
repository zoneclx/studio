
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
import Header from '@/components/header';
import Footer from '@/components/footer';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/create');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Byte AI</title>
        <meta name="description" content="Generate websites with a single prompt." />
      </head>
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-background flex flex-col',
          fontSans.variable,
          fontDisplay.variable,
          isChatPage && 'overflow-hidden'
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
                <Header />
                <main className="relative z-10 flex-1 flex flex-col">
                  {children}
                </main>
                <Footer />
                <Toaster />
                <CookieConsent />
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
