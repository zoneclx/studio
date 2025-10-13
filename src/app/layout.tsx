import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontDisplay = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Monochrome Ai',
  description: 'Generate websites with a single prompt.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          fontSans.variable,
          fontDisplay.variable
        )}
      >
        <div className="min-h-screen w-full bg-background/80 backdrop-blur-sm">
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
