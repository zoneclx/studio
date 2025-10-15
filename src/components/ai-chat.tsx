
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, User, Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleChat } from '@/app/actions';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';
import Image from 'next/image';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string; // data URI for user-uploaded image
};

const AiChatPage = () => {
  const { toast } = useToast();
  const playSound = useSound();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      text: "Hello! I'm Byte AI. How can I help you today? Feel free to ask me anything or upload an image.",
    },
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSendMessage = async () => {
    if (!input.trim() && !image) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: input,
      ...(image && { image }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);
    playSound('send');

    const result = await handleChat(input, image || undefined);
    setIsLoading(false);

    if (result.success && result.data) {
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: result.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      playSound('receive');
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Something went wrong.',
        variant: 'destructive',
      });
      // Restore user input on error
      setMessages((prev) => prev.slice(0, -1)); // Remove the optimistic user message
      setInput(userMessage.text);
      setImage(userMessage.image || null);
      playSound('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((message) => (
                <div key={message.id} className={cn('flex items-start gap-4', message.role === 'user' && 'justify-end')}>
                {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                        <Sparkles className="w-5 h-5 text-primary" />
                    </AvatarFallback>
                    </Avatar>
                )}
                <div className={cn(
                    'max-w-[85%] sm:max-w-[75%] space-y-2',
                    message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                    <div className={cn(
                        'p-3 sm:p-4 rounded-2xl inline-block',
                        message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                    )}>
                        {message.image && (
                            <Image
                                src={message.image}
                                alt="User upload"
                                width={300}
                                height={200}
                                className="rounded-lg mb-2 border"
                            />
                        )}
                        <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
                    </div>
                </div>
                {message.role === 'user' && (
                    <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                        <User className="w-5 h-5 text-muted-foreground" />
                    </AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-4">
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Sparkles className="w-5 h-5 text-primary animate-pulse" /></AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-2xl bg-muted">
                        <div className="flex items-center gap-2">
                           <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-0"></span>
                           <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></span>
                           <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>

        <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-lg">
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    {image && (
                         <div className="absolute bottom-16 left-2 p-1 bg-muted rounded-md border shadow-sm">
                            <div className="relative">
                                <Image src={image} alt="Preview" width={64} height={64} className="rounded-md" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={() => setImage(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className="w-full resize-none pr-28 sm:pr-24 min-h-[52px]"
                        disabled={isLoading}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1 sm:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <Paperclip className="w-5 h-5" />
                            <span className="sr-only">Attach image</span>
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading || (!input.trim() && !image)} size="icon">
                            <Send className="w-5 h-5" />
                             <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </div>
                 <p className="text-xs text-muted-foreground mt-2 text-center hidden sm:block">
                    Shift+Enter for new line. Byte AI can make mistakes.
                </p>
            </div>
        </div>
    </div>
  );
};

export default AiChatPage;
