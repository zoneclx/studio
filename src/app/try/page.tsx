
'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Download, Share2, Sparkles, Wand2, RefreshCw, Save, Code, Eye, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleGeneration, handleChat } from '@/app/actions';
import AiChat from '@/components/ai-chat';
import Header from '@/components/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const examplePrompts = [
  'A portfolio for a freelance photographer',
  'A landing page for a new fitness app',
  'A blog for a passionate home cook',
  'An online store for custom t-shirts',
];

type WebsiteCode = {
  html: string;
};

const TRIAL_LIMITS_KEY = 'monochrome-trial-limits';
const MAX_GENERATIONS = 5;
const MAX_EDITS = 5;

type TrialLimits = {
  generations: number;
  edits: number;
  expires: number;
};

export default function TryPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<WebsiteCode | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [canShare, setCanShare] = useState(false);
  
  const [limits, setLimits] = useState<TrialLimits>({
    generations: MAX_GENERATIONS,
    edits: MAX_EDITS,
    expires: 0
  });
  const [limitDialog, setLimitDialog] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      if (navigator.share || navigator.clipboard) {
        setCanShare(true);
      }
    }
    
    const checkLimits = () => {
      try {
        const storedLimits = localStorage.getItem(TRIAL_LIMITS_KEY);
        const now = new Date().getTime();
        if (storedLimits) {
          const parsedLimits: TrialLimits = JSON.parse(storedLimits);
          if (parsedLimits.expires > now) {
            setLimits(parsedLimits);
            return;
          }
        }
        // Reset limits if not present or expired
        const newLimits: TrialLimits = {
          generations: MAX_GENERATIONS,
          edits: MAX_EDITS,
          expires: now + 24 * 60 * 60 * 1000, // 24 hours from now
        };
        localStorage.setItem(TRIAL_LIMITS_KEY, JSON.stringify(newLimits));
        setLimits(newLimits);
      } catch (e) {
        console.error("Could not access trial limits from localStorage", e);
      }
    }

    checkLimits();
  }, []);

  const useGeneration = () => {
    if (limits.generations <= 0) {
      setLimitDialog(true);
      return false;
    }
    const newLimits = { ...limits, generations: limits.generations - 1 };
    setLimits(newLimits);
    try {
      localStorage.setItem(TRIAL_LIMITS_KEY, JSON.stringify(newLimits));
    } catch(e) {
      console.error("Could not update trial limits", e);
    }
    return true;
  };

  const useEdit = () => {
    if (limits.edits <= 0) {
      setLimitDialog(true);
      return false;
    }
    const newLimits = { ...limits, edits: limits.edits - 1 };
    setLimits(newLimits);
     try {
      localStorage.setItem(TRIAL_LIMITS_KEY, JSON.stringify(newLimits));
    } catch(e) {
      console.error("Could not update trial limits", e);
    }
    return true;
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
    
    if (!useGeneration()) return;

    setPrompt(textToProcess);
    setOutput(null);

    startTransition(async () => {
      const result = await handleGeneration(textToProcess);
      if (result.error) {
        toast({
          title: 'An error occurred',
          description: result.error,
          variant: 'destructive',
        });
        setOutput(null);
        return;
      }
      
      const websiteCode: WebsiteCode = { html: result.html || '' };
      setOutput(websiteCode);
    });
  };

  const handleAiChatMessage = async (text: string, image?: string) => {
    if(!useEdit()) return false;
    return handleChat(text, image);
  };

  const handleDownload = () => {
    if (!output) return;
    try {
      const blob = new Blob([output.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const handleShare = async () => {
    if (!output) return;
    if (navigator.share) {
      await navigator.share({ title: 'Monochrome Ai Website', text: output.html });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(output.html);
      toast({ title: 'Copied to clipboard' });
    }
  };

  const hasReachedLimit = limits.generations <= 0 || limits.edits <= 0;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">Free Trial</h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-3xl mx-auto">
              Experience the power of Monochrome AI. You have a limited number of free generations and edits.
            </p>
          </div>
          
           <Card className="max-w-2xl mx-auto mb-6 bg-accent/50 border-accent">
                <CardContent className="p-4 flex items-center justify-around text-center">
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{limits.generations} generations left</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold">{limits.edits} edits left</span>
                    </div>
                </CardContent>
           </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Controls */}
            <div className="lg:col-span-1 space-y-6 sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Describe Your Website
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., 'A modern landing page for a SaaS product...'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[180px] text-base rounded-md"
                    disabled={isPending || hasReachedLimit}
                  />
                  <Button
                    onClick={() => onGenerate()}
                    disabled={isPending || hasReachedLimit}
                    size="lg"
                    className="w-full font-bold mt-4"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    {isPending ? 'Building...' : 'Generate Website'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>Example Prompts</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {examplePrompts.map((example, i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        onClick={() => onGenerate(example)}
                        disabled={isPending || hasReachedLimit}
                        className="justify-start text-left h-auto"
                      >
                        <Wand2 className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>{example}</span>
                      </Button>
                    ))}
                </CardContent>
              </Card>
              
              {output && !isPending && (
                  <div className="animate-in fade-in duration-500">
                      <Card>
                           <CardHeader>
                              <CardTitle>AI Assistant</CardTitle>
                               <CardDescription>Describe changes you'd like to make.</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0 h-[400px]">
                              <AiChat 
                                  onSendMessage={handleAiChatMessage}
                                  disabled={limits.edits <= 0}
                                  placeholder={limits.edits <= 0 ? "You have reached your edit limit" : "Ask for a change..."}
                              />
                           </CardContent>
                      </Card>
                  </div>
              )}
            </div>

            {/* Right Column - Preview & Code */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg h-full border-border/50 bg-card flex flex-col min-h-[80vh]">
                <Tabs defaultValue="preview" className="flex flex-col h-full w-full">
                  <CardHeader className="flex-row items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4" />Preview</TabsTrigger>
                      <TabsTrigger value="code"><Code className="mr-2 h-4 w-4" />Code</TabsTrigger>
                    </TabsList>
                    {output && !isPending && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onGenerate(prompt)} title="Restart" disabled={isPending || hasReachedLimit}><RefreshCw className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={handleDownload} title="Download"><Download className="h-4 w-4" /></Button>
                        {canShare && <Button variant="ghost" size="icon" onClick={handleShare} title="Share"><Share2 className="h-4 w-4" /></Button>}
                      </div>
                    )}
                  </CardHeader>

                  {isPending && !output ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 flex-1">
                      <Sparkles className="w-12 h-12 mb-4 text-primary animate-pulse" />
                      <p className="font-medium text-lg">Generating your website...</p>
                      <p className="text-muted-foreground">The AI is hard at work. This may take a moment.</p>
                    </div>
                  ) : !output ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 flex-1">
                      <Wand2 className="w-12 h-12 mb-4 text-muted-foreground/50" />
                      <p className="font-medium">Your generated website will appear here.</p>
                      <p className="text-sm text-muted-foreground">Describe your site and click "Generate Website" to begin.</p>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="preview" className="flex-1 h-0 mt-0">
                        <CardContent className="h-full p-2">
                          <iframe
                            srcDoc={output.html}
                            className="w-full h-full border rounded-md bg-white"
                            title="Website Preview"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </CardContent>
                      </TabsContent>
                      <TabsContent value="code" className="flex-1 h-0 mt-0">
                        <CardContent className="h-full p-2">
                          <pre className="h-full overflow-auto whitespace-pre-wrap text-foreground/90 font-mono text-sm bg-muted p-4 rounded-md">
                            <code>{output.html}</code>
                          </pre>
                        </CardContent>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </Card>
            </div>
          </div>
        </main>
      </div>

       <AlertDialog open={limitDialog} onOpenChange={setLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Free Trial Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free generations or edits for today. Please sign up to continue creating with unlimited access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Link href="/signup" passHref>
              <AlertDialogAction>Sign Up Now</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
