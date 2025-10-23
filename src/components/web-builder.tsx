
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { handleWebsiteGeneration } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface WebBuilderProps {
  onGenerationComplete: (files: { name: string; language: string; content: string }[]) => void;
}

const examplePrompts = [
    "A minimal portfolio for a photographer.",
    "A landing page for a new SaaS product.",
    "A simple blog layout with a sidebar.",
    "A coming soon page for a mobile app.",
];

export default function WebBuilder({ onGenerationComplete }: WebBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
      toast({ title: 'Prompt is empty', description: 'Please describe the website you want to build.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await handleWebsiteGeneration(currentPrompt);
      onGenerationComplete(result.files);
    } catch (error) {
      console.error(error);
      toast({ title: 'Generation Failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 pt-24 md:pt-4">
      <div className="relative w-full max-w-3xl">
        <Card className="w-full bg-card/50 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 border border-primary/20">
                <Wand2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-display">
              AI Website Builder
            </CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Describe the website you want to create. The more detail you provide, the better the result will be.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(prompt); }}>
              <div className="relative">
                 <Textarea
                    placeholder="e.g., A modern, dark-themed portfolio website for a graphic designer with a grid layout for projects..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    disabled={isLoading}
                    className="pr-24"
                />
                <Button type="submit" size="icon" className="absolute bottom-3 right-3" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Sparkles className="h-5 w-5" />
                )}
                </Button>
              </div>
            </form>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3 text-center">Or, try an example prompt</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {examplePrompts.map((p, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm" 
                    className="text-left justify-start h-auto py-2"
                    onClick={() => { setPrompt(p); }} 
                    disabled={isLoading}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
