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
    prompt:
      'A modern, minimalist portfolio website for a photographer named Alex Doe. It should have a gallery section with a grid of photos, an about page, and a contact form. The color scheme should be black, white, and a single accent color. The typography should be clean and sans-serif.',
    imageUrl: 'https://picsum.photos/seed/modern-portfolio/600/400',
    imageHint: 'minimalist architecture',
  },
  {
    title: 'SaaS Landing Page',
    description:
      'A professional landing page for your software-as-a-service product. Includes sections for features, pricing, and testimonials.',
    prompt:
      'A professional landing page for a new SaaS product called "Innovate." It needs a hero section with a strong call-to-action, a features section with icons, a three-tiered pricing table, and a customer testimonials section. The design should be clean, corporate, and trustworthy.',
    imageUrl: 'https://picsum.photos/seed/saas-landing/600/400',
    imageHint: 'software interface',
  },
  {
    title: 'Travel Blog',
    description:
      'A beautiful and engaging blog for travel writers. Share your adventures with a stunning photo-first design.',
    prompt:
      'A photo-rich travel blog for a writer named "Wanderlust Jane." The homepage should feature a large hero image and a grid of recent blog posts with featured images. The post pages should have a clean reading experience with beautiful typography. The style should feel adventurous and personal.',
    imageUrl: 'https://picsum.photos/seed/travel-blog/600/400',
    imageHint: 'mountain landscape',
  },
  {
    title: 'E-commerce Store',
    description:
      'A clean and effective online store for your products. Designed to convert visitors into customers with ease.',
    prompt:
      'A clean and modern e-commerce store for a brand selling handmade ceramic goods. The homepage should have a featured products section and a link to the full shop. The product page needs a large image, description, price, and an "Add to Cart" button. The design should be minimalist and focus on the product photography.',
    imageUrl: 'https://picsum.photos/seed/ecommerce-store/600/400',
    imageHint: 'retail product',
  },
  {
    title: 'Restaurant Website',
    description:
      'A delicious-looking website for your restaurant. Showcase your menu, take reservations, and tell your story.',
    prompt:
      'A website for a modern Italian restaurant called "Vesuvius." It needs a homepage with a hero image of the restaurant interior, a section for the menu (appetizers, main courses, desserts), a photo gallery of dishes, and a reservation form. The design should be elegant, warm, and inviting.',
    imageUrl: 'https://picsum.photos/seed/restaurant-site/600/400',
    imageHint: 'gourmet food',
  },
  {
    title: 'Personal CV/Resume',
    description:
      'A professional online resume to impress potential employers. Highlight your skills, experience, and projects in style.',
    prompt:
      'A professional online CV for a software developer named Johnathan Smith. It should include sections for skills (e.g., JavaScript, React, Python), work experience with dates and descriptions, personal projects with links, and contact information. The design should be clean, professional, and easy to read.',
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
          Build a website with a prompt
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
            <Link
              key={preset.title}
              href={`/create?prompt=${encodeURIComponent(preset.prompt)}`}
              passHref
              className="block"
            >
              <Card
                className="border-border/50 bg-card overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col"
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
                <CardContent className="p-6 text-left flex-1">
                  <CardTitle>{preset.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {preset.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
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
