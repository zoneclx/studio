
'use client';

import { useState, useRef, useTransition, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, User, Bot, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { Card } from './ui/card';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

const defaultGreetings: Message[] = [
    { role: 'assistant', content: "Hello! I'm Monochrome Ai. How can I help you build something amazing today?" },
    { role: 'assistant', content: "Greetings! I'm Monochrome Ai, your creative partner. What's on your mind?" },
    { role: 'assistant', content: "Monochrome Ai here! Ready to turn your ideas into reality. What are we creating?" },
    { role: 'assistant', content: "Hi there! I'm Monochrome Ai. Ask me to build a website or make changes to your current one." },
];

type AiChatProps = {
  onSendMessage: (text: string, image?: string) => Promise<any>;
  onClearChat?: () => void;
  disabled?: boolean;
  disableImageUpload?: boolean;
  placeholder?: string;
  defaultInitialMessages?: Message[];
  children?: ReactNode;
};

export default function AiChat({
  onSendMessage,
  onClearChat,
  disabled,
  disableImageUpload,
  placeholder,
  defaultInitialMessages,
  children
}: AiChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [randomGreeting, setRandomGreeting] = useState<Message | null>(null);

  useEffect(() => {
    setRandomGreeting(defaultGreetings[Math.floor(Math.random() * defaultGreetings.length)]);
  }, []);

  useEffect(() => {
    if (defaultInitialMessages && defaultInitialMessages.length > 0) {
      setMessages(defaultInitialMessages);
    } else if(randomGreeting) {
      setMessages([randomGreeting]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultInitialMessages, randomGreeting]);


  const saveChatHistory = (updatedMessages: Message[]) => {
      if(user) {
          try {
            const archive = {
                messages: updatedMessages,
                date: new Date().toISOString(),
            };
            localStorage.setItem(`monochrome-chat-archive-${user.uid}`, JSON.stringify(archive));
          } catch(e) {
              console.error("Failed to save chat archive", e);
          }
      }
  }
  
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
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: 'Image too large',
          description: 'Please select an image smaller than 2MB.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast({ title: 'Image selected', description: file.name });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleLocalSendMessage = () => {
    if (!input.trim() && !image) return;

    const command = input.trim().toLowerCase();
    if (onClearChat && (command === 'clear' || command === 'clear chat')) {
        onClearChat();
        setInput('');
        return;
    }

    const userMessageContent = input.trim();
    const userMessage: Message = {
      role: 'user',
      content: userMessageContent || 'Image attached',
      image: image || undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    clearImage();

    startTransition(async () => {
      const result = await onSendMessage(userMessageContent, image || undefined);

      if (result === false) { // Special case for trial limit
        setMessages((prev) => prev.filter(m => m !== userMessage));
        return;
      }
      
      if (result?.error) {
        toast({
          title: "An error occurred",
          description: result.error,
          variant: "destructive",
        });
        setMessages((prev) => prev.filter(m => m !== userMessage));
        return;
      }
      
      let responseContent = result.response;
      
      if (typeof responseContent === 'string' && responseContent) {
        const assistantMessage: Message = { role: 'assistant', content: responseContent };
        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } else {
        const fallbackResponse = "I don't have a response for that.";
        const assistantMessage: Message = { role: 'assistant', content: fallbackResponse };
        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      }
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {children}
        <div className="space-y-4 p-4">
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
              <Card
                className={`rounded-lg px-3 py-2 max-w-md break-words ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.image && (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2 border">
                    <Image src={message.image} alt="User attachment" layout="fill" objectFit="cover" />
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
              </Card>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8 border">
                   {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name || ''} />
                    ) : null}
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
      <div className="p-4 border-t bg-card sticky bottom-0">
        {image && !disableImageUpload && (
            <div className="relative w-24 h-24 mb-2 rounded-md overflow-hidden border">
                <Image src={image} alt="Selected preview" layout="fill" objectFit="cover" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-black/75 text-white rounded-full"
                    onClick={clearImage}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )}
        <div className="relative">
          <Input
            type="text"
            placeholder={
              placeholder ||
              (disabled ? "You have reached your edit limit" : (image ? 'Describe the image...' : 'Type your message...'))
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
                  type="button"
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
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleLocalSendMessage}
              disabled={isPending || (!input.trim() && !image) || disabled}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
