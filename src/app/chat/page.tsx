
'use client';

import AiChat from '@/components/ai-chat';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';
import { handleCategorization } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const initialMessages = [
    {
        role: 'assistant' as const,
        content: "Hello! I'm your AI assistant. You can ask me for ideas, or tell me what kind of website you'd like to build."
    }
];

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim()) return { handled: false };

    const result = await handleCategorization(text, image);
    if (result.error) {
      toast({
        title: 'An error occurred',
        description: result.error,
        variant: 'destructive',
      });
      return { handled: true, response: "Sorry, I couldn't process that. Please try again." };
    }

    if (result.category === 'code_request' && result.prompt) {
      router.push(`/create?prompt=${encodeURIComponent(result.prompt)}`);
      return { handled: true }; // Prevent AiChat from adding a message
    }
    
    return { handled: true, response: result.response };
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
                  Ask me anything or tell me what website to build.
              </p>
          </div>
          <div className="flex-1 w-full max-w-3xl mx-auto h-0">
            <AiChat
                initialMessages={initialMessages}
                onCategorize={handleSendMessage}
                disableImageUpload={false}
                placeholder="Ask for ideas or say 'Create a blog for a traveler'"
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
