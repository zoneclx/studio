
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  user: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/chat');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      user: {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
      },
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 flex-1 pt-24">
        <header className="mb-8">
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2" />
        </header>
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <Skeleton className="h-16 w-3/4" />
                    <Skeleton className="h-16 w-1/2 ml-auto" />
                    <Skeleton className="h-24 w-3/4" />
                </div>
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl h-full flex flex-col pt-24 pb-10">
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold font-display flex items-center gap-3">
            <MessageSquare className="w-10 h-10" />
            Global Chat
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
            Chat with other users in real-time. (This is a simulation)
        </p>
      </header>
      <Card className="flex-1 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="flex-1 p-6 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            ) : (
                <div className="space-y-6">
                {messages.map((msg) => (
                    <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                        msg.user.uid === user.uid ? 'flex-row-reverse' : ''
                    }`}
                    >
                    <Avatar>
                        <AvatarImage src={msg.user.photoURL} />
                        <AvatarFallback>
                        <UserIcon />
                        </AvatarFallback>
                    </Avatar>
                    <div
                        className={`rounded-lg p-3 max-w-xs md:max-w-md ${
                        msg.user.uid === user.uid
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                    >
                        <p className="font-bold text-sm">{msg.user.displayName}</p>
                        <p className="text-base">{msg.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
