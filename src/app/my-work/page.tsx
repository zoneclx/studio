'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type SavedWork = {
  html: string;
  prompt: string;
  date: string;
};

export default function MyWorkPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [work, setWork] = useState<SavedWork | null>(null);
  const [isLoadingWork, setIsLoadingWork] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      try {
        const savedWork = localStorage.getItem(`monochrome-work-${user.uid}`);
        if (savedWork) {
          setWork(JSON.parse(savedWork));
        }
      } catch (e) {
        console.error("Failed to load work from localStorage", e);
      } finally {
        setIsLoadingWork(false);
      }
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <header className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold font-display">My Archive</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Here is your last saved creation. You can view it and continue editing.
        </p>
      </header>

      {isLoadingWork && (
         <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      )}

      {!isLoadingWork && work ? (
        <Card>
          <CardHeader>
            <CardTitle>Last Saved Website</CardTitle>
            <CardDescription>
              Saved {formatDistanceToNow(new Date(work.date), { addSuffix: true })}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Prompt:</h3>
                <p className="text-muted-foreground p-4 bg-muted rounded-md">{work.prompt}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Preview:</h3>
                 <iframe
                    srcDoc={work.html}
                    className="w-full h-[500px] border rounded-md bg-white"
                    title="Website Preview"
                    sandbox="allow-scripts"
                  />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/create?prompt=${encodeURIComponent(work.prompt)}`} passHref>
                <Button>
                    <Edit className="mr-2 h-4 w-4" />
                    Continue Editing
                </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : !isLoadingWork && (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle>No Saved Work Found</CardTitle>
            <CardDescription>
              You haven't created and saved a website yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create">
              <Button>Start Creating Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
