
'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Info, Sparkles, Wand2, Eye, Code, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneration, handleChat } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiChat from '@/components/ai-chat';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import Header from '@/components/header';

const MAX_GENERATIONS = 5;
const MAX_EDITS = 5;
const TRIAL_STORAGE_KEY = 'monochrome-demo';

const examplePrompts = [
  'A portfolio for a Product Designer',
  'A landing page for a new mobile app',
  'A blog for a travel writer',
];

type TrialData = {
  generations: number;
  edits: number;
  timestamp: number;
};

type WebsiteCode = {
  html: string;
  css: string;
  javascript: string;
};

export default function DemoPage() {
  const [prompt, setPrompt] = useState('');
  const [lastSuccessfulPrompt, setLastSuccessfulPrompt] = useState('');
  const [output, setOutput] = useState<WebsiteCode | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [trial, setTrial] = useState<TrialData | null>(null);
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  
  useEffect(() => {
    try {
      const storedTrial = localStorage.getItem(TRIAL_STORAGE_KEY);
      if (storedTrial) {
        const data: TrialData = JSON.parse(storedTrial);
        const oneDay = 24 * 60 * 60 * 1000;
        if (new Date().getTime() - data.timestamp > oneDay) {
          localStorage.removeItem(TRIAL_STORAGE_KEY);
          setTrial({ generations: 0, edits: 0, timestamp: Date.now() });
        } else {
          setTrial(data);
        }
      } else {
        const newTrial = { generations: 0, edits: 0, timestamp: Date.now() };
        setTrial(newTrial);
        updateTrialStorage(newTrial);
      }
    } catch (e) {
      console.error("Could not read trial data from localStorage", e);
      const newTrial = { generations: 0, edits: 0, timestamp: Date.now() };
      setTrial(newTrial);
      updateTrialStorage(newTrial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTrialStorage = useCallback((data: TrialData) => {
    try {
      localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Could not write trial data to localStorage", e);
    }
  }, []);
  
  const handleGenerate = useCallback((text?: string) => {
    if (!trial) return;
    if (trial.generations >= MAX_GENERATIONS) {
      setIsLimitDialogOpen(true);
      return;
    }
    
    const textToProcess = text || prompt;
    if (!textToProcess) {
      toast({
        title: 'Prompt is empty',
        description: 'Please describe the website you want to create.',
        variant: 'destructive',
      });
      return;
    }

    const newTrialData = { ...trial, generations: trial.generations + 1, timestamp: Date.now() };
    setTrial(newTrialData);
    updateTrialStorage(newTrialData);
    
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
      
      const websiteCode: WebsiteCode = {
          html: result.html || '',
          css: result.css || '',
          javascript: result.javascript || '',
      };
      
      setOutput(websiteCode);
      setLastSuccessfulPrompt(textToProcess);
    });
  }, [prompt, trial, toast, updateTrialStorage]);
  
  const handleAiChatMessage = async (text: string, image?: string) => {
    if (!trial) return { error: "Trial not initialized" };
    if (trial.edits >= MAX_EDITS) {
        setIsLimitDialogOpen(true);
        return false; // Indicate message sending was blocked
    }
    
    const newTrialData = { ...trial, edits: trial.edits + 1, timestamp: Date.now() };
    setTrial(newTrialData);
    updateTrialStorage(newTrialData);

    const result = await handleChat(text, image);

    return result;
  };

  const handleRestart = () => {
    if (lastSuccessfulPrompt) {
      handleGenerate(lastSuccessfulPrompt);
    }
  }

  const getFullHtml = () => {
    if (!output || !output.html) return '';
    return output.html;
  }

  const isDisabled = isPending || !trial || trial.generations >= MAX_GENERATIONS;
  const isChatDisabled = isPending || !trial || trial.edits >= MAX_EDITS;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            Demo Monochrome Ai
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
            Generate up to {MAX_GENERATIONS} websites and make {MAX_EDITS} edits. Your demo resets every 24 hours. Sign up to save your work.
          </p>
        </div>
        <Card className="mt-4 bg-muted/50 border-border">
          <CardContent className="p-4 flex items-center justify-center gap-4 text-sm">
              <Info className="w-5 h-5 text-muted-foreground" />
              <p>
                  Generations left: <span className="font-bold">{trial ? Math.max(0, MAX_GENERATIONS - trial.generations) : '...'}</span>
              </p>
              <p>
                  Edits left: <span className="font-bold">{trial ? Math.max(0, MAX_EDITS - trial.edits) : '...'}</span>
              </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-8">
          {/* Left Column */}
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
                  placeholder="e.g., 'A modern landing page for a SaaS product...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] text-base rounded-md focus-visible:ring-primary"
                  disabled={isDisabled}
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
                        onClick={() => handleGenerate(example)}
                        disabled={isDisabled}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
                 <Button
                  onClick={() => handleGenerate()}
                  disabled={isDisabled}
                  size="lg"
                  className="w-full font-bold mt-4"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isPending ? 'Building...' : 'Create Website'}
                </Button>
              </CardContent>
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
                                disabled={isChatDisabled}
                            />
                         </CardContent>
                    </Card>
                </div>
            )}
          </div>

          {/* Right Column */}
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
                        onClick={() => setIsSignupDialogOpen(true)}
                        aria-label="Save work"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
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
                    ) : output ? (
                      <iframe
                        srcDoc={getFullHtml()}
                        className="w-full h-full border rounded-md bg-white"
                        title="Website Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-md bg-background/50">
                        <Wand2 className="w-12 h-12 mb-4 text-muted-foreground/50" />
                        <p className="font-medium">Your generated website preview will appear here.</p>
                        <p className="text-sm">Describe your site and click "Create Website" to begin.</p>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
                <TabsContent value="code" className="flex-1 h-0 mt-0">
                    <Tabs defaultValue='index.html' className='h-full flex flex-col'>
                      {output ? (
                          <>
                              <TabsList className='mx-2 mt-2 self-start'>
                                  <TabsTrigger value="index.html">index.html</TabsTrigger>
                              </TabsList>
                              <TabsContent value="index.html" className="flex-1 h-0 mt-0">
                                  <CardContent className="h-full p-2">
                                      <pre className="h-full overflow-auto whitespace-pre-wrap text-foreground/90 font-mono text-sm bg-background p-4 rounded-md">
                                          <code>{output.html}</code>
                                      </pre>
                                  </CardContent>
                              </TabsContent>
                          </>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-md bg-background/50">
                            <Code className="w-12 h-12 mb-4 text-muted-foreground/50" />
                            <p className="font-medium">Your generated code will appear here.</p>
                          </div>
                      )}
                    </Tabs>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      
       <AlertDialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You've reached the limit!</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free generations and edits for this session. Please create an account to continue building amazing websites, or wait 24 hours for your demo to reset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Link href="/signup" passHref>
              <AlertDialogAction>Sign Up</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Your Work</AlertDialogTitle>
            <AlertDialogDescription>
              To save your creation and continue editing later, please create an account. Your work will be saved to your personal archive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Link href="/signup" passHref>
              <AlertDialogAction>Sign Up</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
