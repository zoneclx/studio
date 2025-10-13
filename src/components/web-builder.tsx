
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Download, Share2, Sparkles, Wand2, Code, Eye, RefreshCw, Save } from 'lucide-react';

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
import { handleGeneration, handleCategorization } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiChat from '@/components/ai-chat';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';

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
  const { user } = useAuth();
  const router = useRouter();
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

  const saveWork = (html: string, currentPrompt: string) => {
    if (user && html) {
      try {
        const work = {
          html: html,
          prompt: currentPrompt,
          date: new Date().toISOString(),
        };
        localStorage.setItem(`monochrome-work-${user.uid}`, JSON.stringify(work));
        return true;
      } catch (e) {
        console.error("Failed to save work to localStorage", e);
        return false;
      }
    }
    return false;
  }

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
      const resultStream = await handleGeneration(textToProcess);
      
      const reader = resultStream.getReader();
      const decoder = new TextDecoder();
      let accumulatedOutput = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        try {
            const chunk = decoder.decode(value, { stream: true });
            const errorMatch = chunk.match(/{.*"error".*}/);
            if (errorMatch) {
              const errorObj = JSON.parse(errorMatch[0]);
              toast({
                title: 'An error occurred',
                description: errorObj.error,
                variant: 'destructive',
              });
              setOutput(prev => prev); // Stop updating
              return; 
            }
            accumulatedOutput += chunk;
            setOutput(accumulatedOutput);
        } catch (e) {
            // Ignore decoding errors if the chunk is not valid JSON
        }
      }
      
      setLastSuccessfulPrompt(textToProcess);
      saveWork(accumulatedOutput, textToProcess);
    });
  };
  
  const handleAiChatMessage = async (text: string, image?: string) => {
    const result = await handleCategorization(text, image);

    if (result.category === 'code_request' && result.prompt) {
        onGenerate(result.prompt);
    }
    
    return result;
  };

  const handleRestart = () => {
    if (lastSuccessfulPrompt) {
      onGenerate(lastSuccessfulPrompt);
    }
  }
  
  const handleSave = () => {
    if(saveWork(output, prompt)) {
       toast({
        title: 'Work Saved',
        description: 'Your latest creation has been saved to your archive.',
      });
    } else {
       toast({
        title: 'Save Failed',
        description: 'Could not save your work.',
        variant: 'destructive',
      });
    }
  };


  useEffect(() => {
    if (initialPrompt) {
      onGenerate(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleDownload = () => {
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
        title: 'Download failed',
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
      <Header />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
              Web Builder
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Describe the website you want, and let AI build it for you.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Describe Your Website
                </CardTitle>
                <CardDescription>
                  Start with a detailed prompt. The more detail, the better the result.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., 'A modern landing page for a SaaS product with a pricing table...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] text-base rounded-md focus-visible:ring-primary"
                  disabled={isPending}
                  aria-label="Website Description Input"
                />
                 <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Or, try an example:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {examplePrompts.map((example, i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        size="sm"
                        onClick={() => onGenerate(example)}
                        disabled={isPending}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button
                  onClick={() => onGenerate()}
                  disabled={isPending}
                  size="lg"
                  className="w-full font-bold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isPending ? 'Building...' : 'Create Website'}
                </Button>
              </CardFooter>
            </Card>

             {output && !isPending && (
                <div className="animate-in fade-in duration-500">
                    <Card>
                         <CardHeader>
                            <CardTitle>AI Assistant</CardTitle>
                             <CardDescription>Describe any changes you'd like to make.</CardDescription>
                         </CardHeader>
                         <CardContent className="p-0">
                            <AiChat 
                                onSendMessage={handleAiChatMessage}
                            />
                         </CardContent>
                    </Card>
                </div>
            )}
          </div>

          <div className="space-y-6 h-full min-h-[600px] sticky top-24">
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
                        aria-label="Save work to archive"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        aria-label="Download code as an HTML file"
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
                    {isPending && !output ? (
                      <div className="flex items-center justify-center h-full rounded-md bg-background">
                        <div className="space-y-3 p-4 w-full">
                          <div className="flex justify-center items-center gap-2">
                               <Sparkles className="w-5 h-5 animate-pulse text-primary" />
                               <p className="text-muted-foreground">Generating your website...</p>
                           </div>
                           <Skeleton className="h-20 w-full" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ) : (
                      <iframe
                        srcDoc={output}
                        className="w-full h-full border rounded-md bg-white"
                        title="Website Preview"
                        sandbox="allow-scripts"
                      />
                    )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="code" className="flex-1 h-0 mt-0">
                  <CardContent className="h-full p-2">
                    <pre className="h-full overflow-auto whitespace-pre-wrap animate-in fade-in duration-500 text-foreground/90 font-mono text-sm bg-background p-4 rounded-md">
                      <code>
                        {output || (
                           <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-md bg-background/50">
                            <Sparkles className="w-12 h-12 mb-4 text-muted-foreground/50" />
                            <p className="font-medium">Your generated code will appear here.</p>
                            <p className="text-sm">Describe your site and watch the code build in real-time.</p>
                          </div>
                        )}
                      </code>
                    </pre>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; 2025 Monochrome Ai, All rights reserved.
        </p>
      </footer>
    </div>
  );
}
