
'use client';

import { useEffect, useState, useTransition } from 'react';
import AiChat from '@/components/ai-chat';
import Header from '@/components/header';
import { handleChat } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Bot, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [initialMessages, setInitialMessages] = useState<Message[] | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    toast({
      title: 'Disclaimer',
      description: 'Monochrome AI is an experimental tool. The information it provides may not be 100% accurate.',
      duration: 5000,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
      if(user) {
          try {
            const savedChat = localStorage.getItem(`monochrome-chat-archive-${user.uid}`);
            if (savedChat) {
                const parsedChat = JSON.parse(savedChat);
                if(parsedChat.messages && parsedChat.messages.length > 0) {
                    setInitialMessages(parsedChat.messages);
                } else {
                    setInitialMessages(undefined);
                }
            } else {
                setInitialMessages(undefined);
            }
          } catch(e) {
              console.error("Failed to load chat archive", e);
              setInitialMessages(undefined);
          }
      } else {
        setInitialMessages(undefined);
      }
  }, [user]);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const result = await handleChat(text, image);
    return { responseStream: result };
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col h-0">
          <div className="flex-1 w-full h-0">
            <AiChat
                key={user ? user.uid : 'guest'} // Rerender when user logs in/out
                defaultInitialMessages={initialMessages}
                onSendMessage={handleSendMessage}
                disableImageUpload={false}
                placeholder="Ask me anything..."
            >
                <div className="text-center p-4 pt-8">
                    <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
                        AI Chat
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Ask me anything.
                    </p>
                </div>
            </AiChat>
          </div>
      </main>
    </div>
  );
}
