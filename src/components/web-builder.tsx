
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
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
      const files = await handleWebsiteGeneration(currentPrompt);
      onGenerationComplete(files);
    } catch (error) {
      console.error(error);
      toast({ title: 'Generation Failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-display flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Website Builder
          </CardTitle>
          <CardDescription>
            Describe the website you want to create. The more detail, the better the result.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(prompt); }}>
            <Textarea
              placeholder="e.g., A modern, dark-themed portfolio website for a graphic designer with a grid layout..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              disabled={isLoading}
            />
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Website'
              )}
            </Button>
          </form>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2 text-center">Or try an example:</p>
            <div className="grid grid-cols-2 gap-2">
              {examplePrompts.map((p, i) => (
                <Button key={i} variant="outline" size="sm" onClick={() => { setPrompt(p); handleSubmit(p); }} disabled={isLoading}>
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
