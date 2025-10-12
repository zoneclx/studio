'use client';

import { useState, useRef, useTransition } from 'react';
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

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleSendMessage = () => {
    if (!input.trim() && !image) return;

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages];
    if (userMessage) {
      newMessages.push({ role: 'user', content: userMessage });
    }
    
    setMessages(newMessages);
    setInput('');
    setImage(null);
    if(fileInputRef.current) fileInputRef.current.value = '';


    startTransition(async () => {
      const result = await handleChat(userMessage, image || undefined);
      if (result.error) {
        toast({
          title: 'An error occurred',
          description: result.error,
          variant: 'destructive',
        });
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
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">AI Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Describe a change or ask for ideas.
        </p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg px-3 py-2 max-w-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
             <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
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
            placeholder={image ? "Describe the image..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="pr-20"
            disabled={isPending}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSendMessage}
              disabled={isPending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {image && (
          <div className="text-xs text-muted-foreground mt-2">
            Selected image: {fileInputRef.current?.files?.[0]?.name}
          </div>
        )}
      </div>
    </div>
  );
}
