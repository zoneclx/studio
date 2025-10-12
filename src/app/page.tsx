import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, PenTool } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">Monochrome Ai</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center container mx-auto px-4">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
          Build Websites with a Prompt
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
          Welcome to Monochrome Ai, your intelligent partner for web development. Describe your vision, and let our AI bring it to life instantly.
        </p>
        <Link href="/create">
          <Button size="lg">
            Start Creating <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </main>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <PenTool className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Describe Your Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start with a simple description of the website you want to create. Whether it's a portfolio, a blog, or a landing page, just tell us what you need.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Get Instant Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI generates clean, ready-to-use HTML and Tailwind CSS code. You can download the file and use it right away.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Monochrome Ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
