
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, User, Clock, Code } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const mockSharedProjects = [
  {
    id: 'shared-1',
    name: 'E-commerce Homepage',
    sharedBy: { name: 'Jane Doe', avatar: 'https://i.ibb.co/9v3Cq3G/ezgif-com-webp-to-jpg-1.jpg' },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'shared-2',
    name: 'Portfolio Redesign',
    sharedBy: { name: 'John Smith', avatar: 'https://i.ibb.co/ryj1PzC/ezgif-com-webp-to-jpg.jpg' },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 'shared-3',
    name: 'SaaS Dashboard',
    sharedBy: { name: 'Alex Ray', avatar: 'https://i.ibb.co/3k5mR5c/ezgif-com-webp-to-jpg-2.jpg' },
    sharedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
];


export default function SharedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/shared');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);
  
  if (loading || isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4 flex-1 pt-24">
        <header className="mb-8">
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2" />
        </header>
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-display flex items-center gap-3">
          <Users className="w-10 h-10" />
          Shared With Me
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Projects shared with you by other collaborators. (This is a simulation)
        </p>
      </header>

        {mockSharedProjects.length === 0 ? (
             <Card className="p-8 text-center">
                <CardTitle>Nothing Shared Yet</CardTitle>
                <CardDescription className="mt-2">
                    When someone shares a project with you, it will appear here.
                </CardDescription>
            </Card>
        ) : (
            <div className="space-y-4">
                {mockSharedProjects.map((project) => (
                    <Card key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                        <div className="flex-1 mb-4 sm:mb-0">
                           <CardTitle className="text-xl mb-1">{project.name}</CardTitle>
                           <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={project.sharedBy.avatar} alt={project.sharedBy.name} />
                                        <AvatarFallback><User className="w-3 h-3" /></AvatarFallback>
                                    </Avatar>
                                    <span>{project.sharedBy.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDistanceToNow(project.sharedAt, { addSuffix: true })}</span>
                                </div>
                           </div>
                        </div>
                        <Link href="/create">
                            <Button>
                                <Code className="w-4 h-4 mr-2" />
                                Open in Editor
                            </Button>
                        </Link>
                    </Card>
                ))}
            </div>
        )}
    </div>
  );
}
