
'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function TryPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <Bot className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold font-display">
              Builder Coming Soon!
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Our AI-powered website builder is currently under construction, but it will be available soon.
              Sign up to be notified when it's ready!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup" passHref>
              <Button size="lg" className="w-full">Sign Up for Updates</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
