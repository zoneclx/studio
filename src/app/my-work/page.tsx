
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type SavedWork = {
  html: string;
  css: string;
  javascript: string;
  prompt: string;
  date: string;
};

export default function MyWorkPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [work, setWork] = useState<SavedWork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

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
        setIsLoading(false);
      }
    }
  }, [user]);

  const handleDelete = () => {
    if (!user) return;
    const key = `monochrome-work-${user.uid}`;
    
    try {
      localStorage.removeItem(key);
      setWork(null);
      toast({
        title: 'Website Archive Deleted',
        description: 'Your saved work has been removed.',
      });
    } catch (e) {
      console.error('Failed to delete work from localStorage', e);
      toast({
        title: 'Error',
        description: `Could not delete your saved work.`,
        variant: 'destructive',
      });
    } finally {
        setDialogOpen(false);
    }
  };
  
  const getFullHtml = (savedWork: SavedWork | null) => {
    if (!savedWork) return '';
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; }
          ${savedWork.css}
        </style>
      </head>
      <body>
        ${savedWork.html}
        <script>
          ${savedWork.javascript}
        </script>
      </body>
      </html>
    `;
  }

  if (loading || (!user && !isLoading)) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <div className="container mx-auto max-w-4xl py-8 px-4 flex-1">
          <Skeleton className="h-10 w-1/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="space-y-8">
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
        </div>
      </div>
    );
  }

  const noContent = !work;

  return (
    <>
      <div className="flex flex-col min-h-screen p-4">
        <main className="container mx-auto max-w-4xl py-8 px-4 flex-1">
          <header className="mb-8">
            <h1 className="text-4xl font-bold font-display">My Archive</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Here is your last saved work. You can view it and continue where you left off.
            </p>
          </header>
            
          {isLoading && (
             <div className="space-y-8">
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
          )}

          <div className="space-y-8">
            {work && (
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
                          srcDoc={getFullHtml(work)}
                          className="w-full h-[500px] border rounded-md bg-white"
                          title="Website Preview"
                          sandbox="allow-scripts"
                        />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/create?prompt=${encodeURIComponent(work.prompt)}`}>
                      <Button>
                          <Edit className="mr-2 h-4 w-4" />
                          Continue Editing
                      </Button>
                  </Link>
                  <Button variant="destructive" onClick={() => setDialogOpen(true)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                  </Button>
                </CardFooter>
              </Card>
            )}

            {!isLoading && noContent && (
              <Card className="text-center p-8">
                <CardHeader>
                  <CardTitle>No Saved Work Found</CardTitle>
                  <CardDescription>
                    You haven't created a website yet.
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

        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Enzo Gimena's Ai, All rights reserved.
          </p>
        </footer>
      </div>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              saved website from your browser's storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
