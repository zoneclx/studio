
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardHat } from 'lucide-react';
import Link from 'next/link';

export default function UnderDevelopmentPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4 flex-1 flex items-center justify-center pt-24">
      <Card className="w-full animate-fade-in-up text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit border border-primary/20">
            <HardHat className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold font-display mt-4">Feature Under Development</CardTitle>
          <CardDescription className="text-lg mt-2">
            We're working hard to bring this feature to you soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            The AI Web Builder is currently being improved and is not available at the moment. Please check back later. In the meantime, you can use our powerful code editor to build your projects.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/create">
                <Button>Open Editor</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
