
'use client';

import { useEffect, useState } from 'react';
import AiChat from '@/components/ai-chat';
import Header from '@/components/header';
import { handleCategorization } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [initialMessages, setInitialMessages] = useState<Message[] | undefined>(undefined);
  const [chatKey, setChatKey] = useState(user ? user.uid : 'guest');

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
      setChatKey(user ? user.uid : 'guest');
  }, [user]);

  const clearChatHistory = () => {
    if (user) {
        try {
            localStorage.removeItem(`monochrome-chat-archive-${user.uid}`);
            setInitialMessages(undefined);
            // Change the key to force re-mounting of the AiChat component
            setChatKey(prevKey => prevKey + '-cleared');
            toast({
                title: 'Chat Cleared',
                description: 'Your conversation history has been removed.',
            });
        } catch(e) {
            console.error("Failed to clear chat archive", e);
            toast({
                title: 'Error',
                description: 'Could not clear your chat history.',
                variant: 'destructive',
            });
        }
    }
  }

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return { error: "Message is empty" };
    return handleCategorization(text, image);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl h-full max-h-[80vh] flex flex-col">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-display">AI Chat</CardTitle>
                <CardDescription>Ask me anything, or type 'clear' to start over.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 h-0 p-0">
                <AiChat
                    key={chatKey}
                    defaultInitialMessages={initialMessages}
                    onSendMessage={handleSendMessage}
                    onClearChat={clearChatHistory}
                    disableImageUpload={false}
                />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
