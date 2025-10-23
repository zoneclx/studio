
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    image?: string;
}

export default function AiChat() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({ title: "Image too large", description: "Please upload an image smaller than 2MB.", variant: "destructive" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !imagePreview) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user', image: imagePreview || undefined };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setImagePreview(null);
        setIsLoading(true);
        
        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: `This is a simulated AI response to your request: "${input}". Image analysis is also simulated.`
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };


    return (
        <div className="flex flex-col h-full bg-background">
            <header className="flex items-center gap-2 p-3 border-b">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Badge variant="outline">Beta</Badge>
            </header>
            <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                <p>Ask me to make changes to your code!</p>
                                <p className="text-xs">e.g., "Change the background to dark blue"</p>
                            </div>
                        )}
                        {messages.map(msg => (
                            <div key={msg.id} className={cn("flex items-start gap-3", msg.sender === 'user' ? 'flex-row-reverse' : '')}>
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={msg.sender === 'ai' ? 'https://i.ibb.co/3k5mR5c/ezgif-com-webp-to-jpg-2.jpg' : undefined} />
                                    <AvatarFallback>{msg.sender === 'ai' ? 'AI' : 'U'}</AvatarFallback>
                                </Avatar>
                                <div className={cn("rounded-lg p-3 max-w-xs md:max-w-sm break-words", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    {msg.image && <img src={msg.image} alt="uploaded content" className="rounded-md mb-2" />}
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg p-3 bg-muted">
                                    <p className="text-sm animate-pulse">Thinking...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-3 border-t bg-background">
                    <form onSubmit={handleSendMessage} className="relative">
                        {imagePreview && (
                            <div className="relative mb-2 w-20 h-20">
                                <img src={imagePreview} alt="upload preview" className="w-full h-full object-cover rounded-md" />
                                <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => setImagePreview(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe a change or ask a question..."
                            className="pr-20"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                             <label htmlFor="image-upload" className="cursor-pointer">
                                <Button size="icon" variant="ghost" asChild>
                                    <div>
                                        <Upload className="w-5 h-5" />
                                        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </div>
                                </Button>
                            </label>
                            <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !imagePreview)}>
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </CardContent>
        </div>
    );
}
