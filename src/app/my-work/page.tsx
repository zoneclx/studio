
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Header from '@/components/header';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

type SavedWork = {
  html: string;
  css: string;
  javascript: string;
  prompt: string;
  date: string;
};

type SavedMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type SavedChat = {
  messages: SavedMessage[];
  date: string;
}

export default function MyWorkPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [work, setWork] = useState<SavedWork | null>(null);
  const [chat, setChat] = useState<SavedChat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<{ web: boolean; chat: boolean }>({ web: false, chat: false });

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
        const savedChat = localStorage.getItem(`monochrome-chat-archive-${user.uid}`);
        if (savedChat) {
          setChat(JSON.parse(savedChat));
        }
      } catch (e) {
        console.error("Failed to load work from localStorage", e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user]);

  const handleDelete = (type: 'web' | 'chat') => {
    if (!user) return;
    const key = type === 'web' ? `monochrome-work-${user.uid}` : `monochrome-chat-archive-${user.uid}`;
    const title = type === 'web' ? 'Website Archive Deleted' : 'Chat Archive Deleted';
    
    try {
      localStorage.removeItem(key);
      if (type === 'web') setWork(null);
      if (type === 'chat') setChat(null);
      toast({
        title: title,
        description: 'Your saved work has been removed.',
      });
    } catch (e) {
      console.error(`Failed to delete ${type} from localStorage`, e);
      toast({
        title: 'Error',
        description: `Could not delete your saved ${type}.`,
        variant: 'destructive',
      });
    } finally {
        setDialogOpen({ web: false, chat: false });
    }
  };
  
  const getFullHtml = (savedWork: SavedWork | null) => {
    if (!savedWork) return '';
    return savedWork.html
      .replace('<link rel="stylesheet" href="style.css">', `<style>${savedWork.css}</style>`)
      .replace('<script src="script.js" defer></script>', `<script>${savedWork.javascript}</script>`);
  }

  if (loading || (!user && !isLoading)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
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
             <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const noContent = !work && !chat;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
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
                 <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
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
                  <Link href={`/create?prompt=${encodeURIComponent(work.prompt)}`} passHref>
                      <Button>
                          <Edit className="mr-2 h-4 w-4" />
                          Continue Editing
                      </Button>
                  </Link>
                  <Button variant="destructive" onClick={() => setDialogOpen(prev => ({...prev, web: true}))}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                  </Button>
                </CardFooter>
              </Card>
            )}

            {chat && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Last Chat Conversation</CardTitle>
                        <CardDescription>
                            Saved {formatDistanceToNow(new Date(chat.date), { addSuffix: true })}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[400px] overflow-y-auto p-4">
                        {chat.messages.map((message, index) => (
                           <div
                              key={index}
                              className={`flex items-start gap-3 ${
                                message.role === 'user' ? 'justify-end' : ''
                              }`}
                            >
                              {message.role === 'assistant' && (
                                <Avatar className="w-8 h-8 border">
                                   <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`rounded-lg px-3 py-2 max-w-md break-words ${
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              {message.role === 'user' && (
                                <Avatar className="w-8 h-8 border">
                                   {user?.avatar ? (
                                        <AvatarImage src={user.avatar} alt={user.name || ''} />
                                    ) : null}
                                  <AvatarFallback>
                                    <User />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter className="flex justify-between">
                        <Link href="/chat" passHref>
                            <Button>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Continue Conversation
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={() => setDialogOpen(prev => ({...prev, chat: true}))}>
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
                    You haven't created a website or had a conversation yet.
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
      
      <AlertDialog open={dialogOpen.web} onOpenChange={(open) => setDialogOpen(p => ({...p, web: open}))}>
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
            <AlertDialogAction onClick={() => handleDelete('web')} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogOpen.chat} onOpenChange={(open) => setDialogOpen(p => ({...p, chat: open}))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              saved chat history from your browser's storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete('chat')} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
