
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <main className="container mx-auto max-w-4xl py-8 px-4 flex-1">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              Our AI website builder is currently under development and will be available soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
