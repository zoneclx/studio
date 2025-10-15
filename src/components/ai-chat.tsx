
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paperclip, Send, Bot, User, Image as ImageIcon, CornerDownLeft, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { handleChat } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useSound } from '@/hooks/use-sound';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  image?: string;
};

const greetings = [
  "Hello! I'm Monochrome AI, your creative partner. How can I help you bring your ideas to life today?",
  "Greetings! I am Monochrome AI. What shall we create together?",
  "Welcome! I'm Monochrome AI. Feel free to describe a website, or even show me an image for inspiration.",
  "Hi there! Monochrome AI at your service. Let's build something amazing.",
];

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const playSound = useSound();

  useEffect(() => {
    // Select a random greeting and display it as the first message
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setMessages([{ id: 'initial', type: 'bot', text: randomGreeting }]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast({ title: 'Image selected', description: 'Your image is ready to be sent.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() && !image) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      ...(image && { image }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setIsLoading(true);
    playSound('send');

    try {
      const response = await handleChat(input, image);
      if (response.error) {
        throw new Error(response.error);
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response.text || "I'm not sure how to respond to that.",
      };
      setMessages((prev) => [...prev, botMessage]);
      playSound('receive');

    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to get a response from the AI.',
        variant: 'destructive',
      });
      // Restore user input on failure
      setInput(userMessage.text);
      setImage(userMessage.image || null);
       setMessages((prev) => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  }, [input, image, playSound, toast]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-lg shadow-2xl">
      <CardHeader className="flex flex-row items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
            {msg.type === 'bot' && <Bot className="w-6 h-6 text-primary flex-shrink-0" />}
            <div className={`rounded-lg p-3 max-w-[80%] ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.image && (
                    <Image src={msg.image} alt="User upload" width={200} height={200} className="rounded-md mb-2" />
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.type === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                <Bot className="w-6 h-6 text-primary animate-pulse" />
                <div className="rounded-lg p-3 bg-muted w-2/4">
                    <div className="h-4 w-full bg-muted-foreground/20 rounded-full animate-pulse"></div>
                </div>
            </div>
         )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="relative w-full">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the change you want to make..."
            className="pr-24 min-h-[40px]"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              aria-label="Attach image"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && !image)}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          {image && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-muted rounded-lg border w-full">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">Image selected: {fileInputRef.current?.files?.[0]?.name}</span>
                    <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setImage(null)}>&times;</Button>
                </div>
            </div>
          )}
           <p className="text-xs text-muted-foreground mt-2">
            Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <CornerDownLeft className="h-3 w-3" />
            </kbd> to send.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
