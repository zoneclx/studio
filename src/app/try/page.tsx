
'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Info, RefreshCw, Save, Sparkles, Wand2, Eye, Code } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Header from '@/components/header';

const MAX_GENERATIONS = 5;
const MAX_UPGRADES = 5;
const TRIAL_STORAGE_KEY = 'monochrome-trial';

const examplePrompts = [
  'A portfolio website for a photographer.',
  'A landing page for a new mobile app.',
  'A blog for a travel writer.',
  'An e-commerce site for handmade jewelry.',
];

export default function TryPage() {
  const [prompt, setPrompt] = useState('');
  const [lastSuccessfulPrompt, setLastSuccessfulPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [generations, setGenerations] = useState(0);
  const [upgrades, setUpgrades] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const storedTrial = localStorage.getItem(TRIAL_STORAGE_KEY);
      if (storedTrial) {
        const { generations: storedGens, upgrades: storedUpgrades, timestamp } = JSON.parse(storedTrial);
        const oneDay = 24 * 60 * 60 * 1000;
        if (new Date().getTime() - timestamp > oneDay) {
          localStorage.removeItem(TRIAL_STORAGE_KEY);
        } else {
          setGenerations(storedGens || 0);
          setUpgrades(storedUpgrades || 0);
        }
      }
    } catch (e) {
      console.error("Could not read trial data from localStorage", e);
    }
  }, []);

  const updateStorage = (genCount: number, upgCount: number) => {
    try {
      const timestamp = new Date().getTime();
      localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify({ generations: genCount, upgrades: upgCount, timestamp }));
    } catch (e) {
      console.error("Could not write trial data to localStorage", e);
    }
  };
  
  const handleGenerate = (text?: string) => {
    if (generations >= MAX_GENERATIONS) {
      setIsLimitReached(true);
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

    const newGenCount = generations + 1;
    setGenerations(newGenCount);
    updateStorage(newGenCount, upgrades);
    
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
  
  const handleAiChatMessage = async (text: string, image?: string) => {
    if (upgrades >= MAX_UPGRADES) {
        setIsLimitReached(true);
        return false; // Indicate message sending was blocked
    }
    
    const result = await handleCategorization(text, image);

    if (result.error) {
        return "Sorry, I couldn't process that. Please try again.";
    }

    const newUpgCount = upgrades + 1;
    setUpgrades(newUpgCount);
    updateStorage(generations, newUpgCount);

    if (result.category === 'code_request' && result.prompt) {
        handleGenerate(result.prompt);
        return `I've started generating a new website based on your request: "${result.prompt}". Check out the preview!`;
    }

    return result.response || "I don't have a response for that.";
  };

  const handleRestart = () => {
    if (lastSuccessfulPrompt) {
      handleGenerate(lastSuccessfulPrompt);
    }
  }

  const handleSave = () => {
    setIsSignupDialogOpen(true);
  }

  const isDisabled = isPending || generations >= MAX_GENERATIONS;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <Header />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">
            Try Monochrome Ai
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Generate up to 5 websites and make 5 edits. Your trial resets every 24 hours.
          </p>
        </div>
        <Card className="mt-4 bg-accent/50 border-accent">
          <CardContent className="p-4 flex items-center justify-center gap-4 text-sm">
              <Info className="w-5 h-5 text-accent-foreground" />
              <p className="text-accent-foreground">
                  Generations left: <span className="font-bold">{Math.max(0, MAX_GENERATIONS - generations)}</span>
              </p>
              <p className="text-accent-foreground">
                  Edits left: <span className="font-bold">{Math.max(0, MAX_UPGRADES - upgrades)}</span>
              </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
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
                  disabled={isDisabled}
                  aria-label="Website Description Input"
                />
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <Button
                  onClick={() => handleGenerate()}
                  disabled={isDisabled}
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
                          handleGenerate(example);
                        }}
                        disabled={isDisabled}
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
                        aria-label="Save work"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
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
                      <pre className="h-full overflow-auto whitespace-pre-wrap animate-in fade-in duration-500 text-foreground/90 font-mono text-sm bg-background p-4 rounded-md">
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
            <AiChat 
                onSendMessage={handleAiChatMessage}
                disabled={upgrades >= MAX_UPGRADES}
            />
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; 2025 Monochrome Ai, All rights reserved.
        </p>
      </footer>
       <AlertDialog open={isLimitReached} onOpenChange={setIsLimitReached}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You've reached the limit!</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free generations and edits for this session. Please create an account to continue building amazing websites, or wait 24 hours for your trial to reset.
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
