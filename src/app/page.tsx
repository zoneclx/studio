'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';

const presets = [
  {
    title: 'Photographer Portfolio',
    description:
      'A sleek, modern portfolio for a photographer to showcase their work, featuring a gallery, an about me page, and a contact form.',
    prompt:
      'A sleek, modern portfolio for a photographer named "Alex Doe", featuring a stunning photo gallery, an about me page, and a contact form. Use a dark theme with vibrant accent colors.',
    image: 'https://picsum.photos/seed/photographer-portfolio/600/400',
    imageHint: 'sleek dark',
  },
  {
    title: 'Mobile App Landing Page',
    description:
      'A vibrant and engaging landing page for a new mobile app, designed to drive downloads and user engagement.',
    prompt:
      'A vibrant and engaging landing page for a new mobile app called "ConnectSphere". It should have a clear call-to-action to download from the App Store and Google Play, feature screenshots, and list key benefits.',
    image: 'https://picsum.photos/seed/mobile-app-landing/600/400',
    imageHint: 'vibrant engaging',
  },
  {
    title: 'Travel Blog',
    description:
      'A beautiful and personal blog for a travel writer, with a focus on storytelling and stunning imagery.',
    prompt:
      'A beautiful and personal blog for a travel writer named "Journeying Jane". The design should be clean and focus on large, high-quality images and elegant typography. Include sections for different destinations.',
    image: 'https://picsum.photos/seed/travel-blog/600/400',
    imageHint: 'travel blog',
  },
  {
    title: 'E-commerce Store',
    description:
      'A stylish online store for selling handmade jewelry, with product listings, a shopping cart, and a secure checkout.',
    prompt:
      'A stylish and elegant e-commerce site for "Gemstone Gems", a boutique for handmade jewelry. The site needs a homepage with featured products, a product listing page with filters, and a shopping cart icon in the header.',
    image: 'https://picsum.photos/seed/ecommerce-store/600/400',
    imageHint: 'stylish elegant',
  },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
        <nav>
          {user ? (
            <Link href="/create">
              <Button>Go to Builder</Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4">
          Build a website with a single prompt
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-8">
          Monochrome AI is a powerful tool that allows you to generate
          beautiful, production-ready websites using simple text prompts.
          Describe your vision, and watch as our AI brings it to life, helping
          you refine and perfect your creation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/create">
            <Button size="lg" className="font-bold text-lg w-full sm:w-auto">
              Start Creating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/try">
            <Button size="lg" variant="outline" className="font-bold text-lg w-full sm:w-auto">
              Try for Free
            </Button>
          </Link>
        </div>
      </main>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h3 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-center mb-12">
          Start with a beautiful preset
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {presets.map((preset) => (
            <Card
              key={preset.title}
              className="bg-card border-border/50 flex flex-col"
            >
              <CardHeader>
                <div className="aspect-[3/2] rounded-t-lg overflow-hidden mb-4">
                  <Image
                    src={preset.image}
                    alt={preset.title}
                    width={600}
                    height={400}
                    data-ai-hint={preset.imageHint}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle>{preset.title}</CardTitle>
                <CardDescription className="flex-grow">
                  {preset.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={`/create?prompt=${encodeURIComponent(preset.prompt)}`} className="w-full">
                  <Button className="w-full" variant="secondary">
                    Use Preset
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Monochrome Ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
