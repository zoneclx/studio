'use client';

import { useState, useTransition, useEffect } from 'react';
import { Download, Share2, Sparkles, Wand2, Code, Eye, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneration } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiChat from '@/components/ai-chat';

const examplePrompts = [
  'A portfolio website for a photographer.',
  'A landing page for a new mobile app.',
  'A blog for a travel writer.',
  'An e-commerce site for handmade jewelry.',
];

type WebBuilderProps = {
  initialPrompt?: string;
};

export default function WebBuilder({ initialPrompt = '' }: WebBuilderProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [lastSuccessfulPrompt, setLastSuccessfulPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [canShare, setCanShare] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator.share || navigator.clipboard)) {
      setCanShare(true);
    }
  }, []);

  const onGenerate = (text?: string) => {
    const textToProcess = text || prompt;
    if (!textToProcess) {
      toast({
        title: 'Prompt is empty',
        description: 'Please describe the website you want to create.',
        variant: 'destructive',
      });
      return;
    }

    setPrompt(textToProcess);
    setOutput('');

    startTransition(async () => {
      const result = await handleGeneration(textToProcess);
      if (result.error) {
        toast({
          title: 'An error occurred',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setOutput(result.text || '');
        setLastSuccessfulPrompt(textToProcess);
      }
    });
  };

  const handleRestart = () => {
    if (lastSuccessfulPrompt) {
      onGenerate(lastSuccessfulPrompt);
    }
  }

  useEffect(() => {
    if (initialPrompt) {
      onGenerate(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSave = () => {
    if (!output) return;
    try {
      const blob = new Blob([output], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      toast({
        title: 'Save failed',
        description: 'Could not save the file.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!output) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Monochrome Ai Website Generation',
          text: output,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Error sharing:', error);
        toast({
          title: 'Sharing failed',
          description: 'Could not share the generated code.',
          variant: 'destructive',
        });
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(output);
        toast({
          title: 'Copied to clipboard',
          description: 'Share API not supported, code copied to clipboard.',
        });
      } catch (err) {
        toast({
          title: 'Failed to copy',
          description: 'Could not copy code to clipboard.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
              Web Builder
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Describe the website you want, and let AI build it for you.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="shadow-lg border-border/50 bg-card">
              <CardHeader>
                <CardTitle>Describe Your Website</CardTitle>
                <CardDescription>
                  Enter as much detail as you'd like.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., 'A modern landing page for a SaaS product with a pricing table...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] text-base rounded-md focus-visible:ring-primary bg-background"
                  disabled={isPending}
                  aria-label="Website Description Input"
                />
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <Button
                  onClick={() => onGenerate()}
                  disabled={isPending}
                  size="lg"
                  className="w-full font-bold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isPending ? 'Building...' : 'Create Website'}
                </Button>
                <div className="space-y-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    Or, try one of these ideas:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {examplePrompts.map((example, i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onGenerate(example);
                        }}
                        disabled={isPending}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6 h-full min-h-[600px] lg:min-h-0">
            <Card className="shadow-lg h-full border-border/50 bg-card flex flex-col">
              <Tabs
                defaultValue="preview"
                className="flex flex-col h-full w-full"
              >
                <CardHeader className="flex-row items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="preview">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code">
                      <Code className="mr-2 h-4 w-4" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                  {output && !isPending && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRestart}
                        aria-label="Restart"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        aria-label="Save code as an HTML file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {canShare && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleShare}
                          aria-label="Share generated code"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <TabsContent value="preview" className="flex-1 h-0 mt-0">
                  <CardContent className="h-full p-2">
                    {isPending ? (
                      <div className="flex items-center justify-center h-full rounded-md bg-background">
                        <div className="space-y-3 p-4 w-full">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ) : output ? (
                      <iframe
                        srcDoc={output}
                        className="w-full h-full border rounded-md bg-white"
                        title="Website Preview"
                        sandbox="allow-scripts"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8 rounded-md bg-background">
                        <p>
                          Your generated website preview will appear here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="code" className="flex-1 h-0 mt-0">
                  <CardContent className="h-full p-2">
                    {isPending ? (
                      <div className="space-y-3 p-4 h-full rounded-md bg-background">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : (
                      <pre className="h-full overflow-auto whitespace-pre-wrap animate-in fade-in duration-500 text-foreground/90 font-code text-sm bg-background p-4 rounded-md">
                        <code>
                          {output || (
                            <p className="text-muted-foreground font-sans text-center">
                              Your generated website code will appear here.
                            </p>
                          )}
                        </code>
                      </pre>
                    )}
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
        {output && !isPending && (
          <div className="mt-8">
            <AiChat />
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Monochrome Ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
