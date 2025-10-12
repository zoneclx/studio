'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

const presets = [
  {
    title: 'Modern Portfolio',
    description:
      'A sleek and stylish portfolio to showcase your photography, design, or art. Features a clean grid and a minimalist aesthetic.',
    imageUrl: 'https://picsum.photos/seed/modern-portfolio/600/400',
    imageHint: 'minimalist architecture',
  },
  {
    title: 'SaaS Landing Page',
    description:
      'A professional landing page for your software-as-a-service product. Includes sections for features, pricing, and testimonials.',
    imageUrl: 'https://picsum.photos/seed/saas-landing/600/400',
    imageHint: 'software interface',
  },
  {
    title: 'Travel Blog',
    description:
      'A beautiful and engaging blog for travel writers. Share your adventures with a stunning photo-first design.',
    imageUrl: 'https://picsum.photos/seed/travel-blog/600/400',
    imageHint: 'mountain landscape',
  },
  {
    title: 'E-commerce Store',
    description:
      'A clean and effective online store for your products. Designed to convert visitors into customers with ease.',
    imageUrl: 'https://picsum.photos/seed/ecommerce-store/600/400',
    imageHint: 'retail product',
  },
  {
    title: 'Restaurant Website',
    description:
      'A delicious-looking website for your restaurant. Showcase your menu, take reservations, and tell your story.',
    imageUrl: 'https://picsum.photos/seed/restaurant-site/600/400',
    imageHint: 'gourmet food',
  },
  {
    title: 'Personal CV/Resume',
    description:
      'A professional online resume to impress potential employers. Highlight your skills, experience, and projects in style.',
    imageUrl: 'https://picsum.photos/seed/personal-cv/600/400',
    imageHint: 'professional headshot',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Monochrome Ai
          </Link>
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center text-center container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-4">
          Choose Your Perfect Website Preset
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-8">
          Browse our curated collection of beautifully designed website
          templates. Pick a preset and let our AI customize it to fit your
          vision.
        </p>
        <Link href="/signup">
          <Button size="lg" className="font-bold text-lg">
            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {presets.map((preset) => (
            <Card
              key={preset.title}
              className="border-border/50 bg-card overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"
            >
              <CardHeader className="p-0">
                <Image
                  src={preset.imageUrl}
                  alt={preset.title}
                  width={600}
                  height={400}
                  data-ai-hint={preset.imageHint}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </CardHeader>
              <CardContent className="p-6 text-left">
                <CardTitle>{preset.title}</CardTitle>
                <CardDescription className="mt-2">
                  {preset.description}
                </CardDescription>
              </CardContent>
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
