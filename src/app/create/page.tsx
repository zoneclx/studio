
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import WebEditor from '@/components/web-editor';
import WebBuilder from '@/components/web-builder';

interface WebFile {
    name: string;
    language: string;
    content: string;
}

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [generatedFiles, setGeneratedFiles] = useState<WebFile[] | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup?redirect=/create');
    }
  }, [user, loading, router]);

  const handleGenerationComplete = (files: WebFile[]) => {
    setGeneratedFiles(files);
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col flex-1 h-full p-4">
        <main className="container mx-auto max-w-3xl py-8 px-4 flex-1">
            <div className="space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-1/2 ml-auto" />
                <Skeleton className="h-24 w-3/4" />
            </div>
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
                <Skeleton className="h-12 w-full" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen">
        {generatedFiles ? (
            <WebEditor initialFiles={generatedFiles} />
        ) : (
            <WebBuilder onGenerationComplete={handleGenerationComplete} />
        )}
    </div>
  );
}
