
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/context/theme-context';
import CookieConsent from '@/components/cookie-consent';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontDisplay = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

// export const metadata: Metadata = {
//   title: 'MonoMuse',
//   description: 'Generate websites with a single prompt.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>MonoMuse</title>
        <meta name="description" content="Generate websites with a single prompt." />
      </head>
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-background animated-gradient',
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <ThemeProvider>
            <div className="relative z-10">
              <AuthProvider>{children}</AuthProvider>
              <Toaster />
              <CookieConsent />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
