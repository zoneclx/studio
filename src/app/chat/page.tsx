
'use client';

import AiChat from '@/components/ai-chat';
import Header from '@/components/header';
import { handleChat } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const initialMessages = [
    {
        role: 'assistant' as const,
        content: "Hello! I'm Monochrome Ai. You can ask me anything."
    }
];

export default function ChatPage() {
  const { toast } = useToast();

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim()) return;

    const result = await handleChat(text, image);
    if (result.error) {
      toast({
        title: 'An error occurred',
        description: result.error,
        variant: 'destructive',
      });
      return "Sorry, I couldn't process that. Please try again.";
    }
    
    return result.response || "I don't have a response for that.";
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-0">
          <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
                  AI Chat
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                  Ask me anything.
              </p>
          </div>
          <Alert className="max-w-3xl mx-auto mb-8 bg-accent/50 border-accent">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              Monochrome AI is an experimental tool. The information it provides may not be 100% accurate. Please verify important information.
            </AlertDescription>
          </Alert>
          <div className="flex-1 w-full max-w-3xl mx-auto h-0">
            <AiChat
                initialMessages={initialMessages}
                onSendMessage={handleSendMessage}
                disableImageUpload={false}
                placeholder="Ask me anything..."
            />
          </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; 2025 Enzo Gimena's Ai, All rights reserved.
        </p>
      </footer>
    </div>
  );
}
