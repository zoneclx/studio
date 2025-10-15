
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, User, Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleChat } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string;
};

const examplePrompts = [
    "What's in this picture?",
    "Explain quantum computing in simple terms.",
    "Give me 3 startup ideas for a SaaS company.",
    "Write a short, funny story about a cat who becomes a detective.",
];

const AiChatPage = () => {
  const { toast } = useToast();
  const playSound = useSound();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current && !isLoading) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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

  const handleSendMessage = async (promptText = input) => {
    if (!promptText.trim() && !image) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      ...(image && { image }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);
    playSound('send');

    const result = await handleChat(promptText, image || undefined);
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
      // Revert adding the user's message if AI fails
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
      setInput(userMessage.text);
      setImage(userMessage.image || null);
      playSound('error');
    }
  };
  
  const handleExamplePrompt = (prompt: string) => {
    setInput(prompt);
    // Automatically send message for example prompts
    setTimeout(() => {
        handleSendMessage(prompt);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full items-center justify-center p-4">
              <div className="text-center">
                   <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                      <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display mb-2">Hello, I'm Byte AI</h1>
                  <p className="text-muted-foreground mb-8 max-w-md">How can I help you today? Feel free to ask me anything or upload an image.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                      {examplePrompts.map((prompt) => (
                          <button
                              key={prompt}
                              onClick={() => handleExamplePrompt(prompt)}
                              className="text-left p-3 border rounded-lg hover:bg-muted transition-colors text-sm disabled:opacity-50"
                              disabled={isLoading}
                          >
                              {prompt}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
        ) : (
          <div className="p-4 md:p-6">
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
                  <div className={cn('max-w-[85%] sm:max-w-[75%] space-y-2', message.role === 'user' ? 'text-right' : 'text-left')}>
                    <div className={cn('p-3 sm:p-4 rounded-2xl inline-block', message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                      {message.image && (
                        <Image src={message.image} alt="User upload" width={300} height={200} className="rounded-lg mb-2 border" />
                      )}
                      <p className="whitespace-pre-wrap text-sm sm:text-base">{message.text}</p>
                    </div>
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="w-8 h-8 border">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback><User className="w-5 h-5 text-muted-foreground" /></AvatarFallback>
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
        )}
      </div>

      <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {image && (
              <div className="absolute bottom-16 left-2 p-1 bg-muted rounded-md border shadow-sm">
                <div className="relative">
                  <Image src={image} alt="Preview" width={64} height={64} className="rounded-md object-cover" />
                  <Button
                    variant="destructive" size="icon"
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
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="w-5 h-5" />
                <span className="sr-only">Attach image</span>
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <Button onClick={() => handleSendMessage()} disabled={isLoading || (!input.trim() && !image)} size="icon">
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
