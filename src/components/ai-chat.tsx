
'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { handleChat } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type CategorizationResult = {
  handled: boolean;
  response?: string;
};

type AiChatProps = {
  onSendMessage?: () => boolean; // For trial limit
  disabled?: boolean;
  onCategorize?: (text: string, image?: string) => Promise<CategorizationResult | void>;
  disableImageUpload?: boolean;
  placeholder?: string;
  initialMessages?: Message[];
};

export default function AiChat({
  onSendMessage,
  disabled,
  onCategorize,
  disableImageUpload,
  placeholder,
  initialMessages = [],
}: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast({ title: 'Image selected', description: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalSendMessage = () => {
    if (onSendMessage && !onSendMessage()) {
      return;
    }

    if (!input.trim() && !image) return;

    const userMessage = input.trim();

    // Add user message to chat immediately
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    startTransition(async () => {
      // If a categorization handler is provided, use it.
      if (onCategorize) {
        const result = await onCategorize(userMessage, image || undefined);
        if (result?.handled && result.response) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: result.response! },
          ]);
        } else if (result?.handled) {
          // Handled, but no response (e.g. redirection). Do nothing.
          // But we need to remove the user message we added optimistically
          setMessages((prev) => prev.slice(0, prev.length - 1));
        }
        return;
      }

      // Default behavior: use the `handleChat` action
      const result = await handleChat(userMessage, image || undefined);
      if (result.error) {
        toast({
          title: 'An error occurred',
          description: result.error,
          variant: 'destructive',
        });
        // Remove the optimistic user message on error
        setMessages((prev) => prev.slice(0, prev.length - 1));
      } else if (result.response) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: result.response! },
        ]);
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border/50 rounded-lg shadow-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
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
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-3 py-2 max-w-sm bg-muted w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background/50 rounded-b-lg">
        <div className="relative">
          <Input
            type="text"
            placeholder={
              placeholder ||
              (image ? 'Describe the image...' : 'Type your message...')
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLocalSendMessage()}
            className="pr-20"
            disabled={isPending || disabled}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {!disableImageUpload && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending || disabled}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLocalSendMessage}
              disabled={isPending || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {image && !disableImageUpload && (
          <div className="text-xs text-muted-foreground mt-2">
            Selected image: {fileInputRef.current?.files?.[0]?.name}
          </div>
        )}
      </div>
    </div>
  );
}
