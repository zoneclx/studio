
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Bot } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleChat } from '@/app/actions';
import AiChat from '@/components/ai-chat';
import Header from '@/components/header';

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  const handleAiChatMessage = async (text: string, image?: string) => {
    return handleChat(text, image);
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
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
      <Header />
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center p-8">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                    <Bot className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold font-display">
                  Builder Coming Soon!
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Our AI website builder is currently under development. While you wait, feel free to chat with our AI assistant to discuss your ideas!
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="lg:col-span-1 animate-in fade-in duration-500">
                <Card className="h-[70vh]">
                     <CardHeader>
                        <CardTitle>AI Assistant</CardTitle>
                         <CardDescription>Ask me anything or share an idea.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-0 h-full">
                        <AiChat 
                            onSendMessage={handleAiChatMessage}
                        />
                     </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
