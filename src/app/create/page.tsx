
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import WebBuilder from '@/components/web-builder';

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup?redirect=/create');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen p-4">
        <main className="container mx-auto max-w-7xl py-8 px-4 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <Skeleton className="h-10 w-1/2 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
                 <div>
                    <Skeleton className="h-10 w-1/4 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  return <WebBuilder mode="pro" />;
}
