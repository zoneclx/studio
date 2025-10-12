'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WebBuilder from '@/components/web-builder';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreatePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground p-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-8 w-1/2" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return <WebBuilder />;
}
