
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { FileCode, PlusCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SavedFile {
  name: string;
  language: string;
  content: string;
}

interface SavedWork {
  id: string;
  name: string;
  files: SavedFile[];
  timestamp: string;
}

export default function MyArchivePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [savedWork, setSavedWork] = useState<SavedWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/my-archive');
    }
    if (user) {
      try {
        const data = localStorage.getItem(`monostudio-archive-${user.uid}`);
        if (data) {
          const parsedData: SavedWork[] = JSON.parse(data);
          // Sort by timestamp descending
          parsedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setSavedWork(parsedData);
        }
      } catch (error) {
        console.error('Failed to load saved work from localStorage', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4 flex-1 pt-24">
        <header className="mb-8">
            <Skeleton className="h-10 w-2/3 md:w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2 md:w-1/2" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 flex-1 pt-24">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
            <h1 className="text-4xl font-bold font-display">Your Projects</h1>
            <p className="text-muted-foreground mt-2 text-lg">
            Manage your saved projects or start a new one.
            </p>
        </div>
        <Link href="/create" className='mt-4 md:mt-0'>
            <Button>
                <PlusCircle className="w-5 h-5 mr-2" />
                New Project
            </Button>
        </Link>
      </header>
      
      {savedWork.length === 0 ? (
        <Card className="p-8 py-16 text-center animate-fade-in-up">
            <CardTitle className="text-2xl">No Projects Found</CardTitle>
            <CardDescription className="mt-2">
                You haven't saved any projects yet. Go to the editor to start creating!
            </CardDescription>
            <Link href="/create" className='mt-6 inline-block'>
                <Button>
                    Start Coding
                </Button>
            </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedWork.map((project, index) => (
                <div key={project.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <FileCode className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="mt-4">{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Updated {formatDistanceToNow(new Date(project.timestamp), { addSuffix: true })}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/create?edit=${project.id}`} className="w-full">
                                <Button variant="outline" className="w-full">Open in Editor</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
