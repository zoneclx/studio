
'use client';

import { useState, useTransition, useEffect, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import {
  Download,
  Share2,
  Sparkles,
  Wand2,
  Code,
  Eye,
  ArrowLeft,
  Info,
  RefreshCw,
} from 'lucide-react';
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

const MAX_GENERATIONS = 5;
const MAX_UPGRADES = 5;

interface TrialContextType {
  generations: number;
  upgrades: number;
  incrementGenerations: () => boolean;
  incrementUpgrades: () => boolean;
  limitReached: boolean;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

const TrialProvider = ({ children }: { children: ReactNode }) => {
  const [generations, setGenerations] = useState(0);
  const [upgrades, setUpgrades] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    try {
      const storedGenerations = sessionStorage.getItem('trial-generations');
      const storedUpgrades = sessionStorage.getItem('trial-upgrades');
      setGenerations(storedGenerations ? parseInt(storedGenerations, 10) : 0);
      setUpgrades(storedUpgrades ? parseInt(storedUpgrades, 10) : 0);
    } catch (e) {
      // sessionStorage not available
    }
  }, []);

  const updateStorage = (key: string, value: number) => {
     try {
      sessionStorage.setItem(key, value.toString());
    } catch (e) {
      // sessionStorage not available
    }
  };

  const incrementGenerations = () => {
    if (generations >= MAX_GENERATIONS) {
      setLimitReached(true);
      return false;
    }
    const newCount = generations + 1;
    setGenerations(newCount);
    updateStorage('trial-generations', newCount);
    return true;
  };

  const incrementUpgrades = () => {
    if (upgrades >= MAX_UPGRADES) {
      setLimitReached(true);
      return false;
    }
    const newCount = upgrades + 1;
    setUpgrades(newCount);
    updateStorage('trial-upgrades', newCount);
    return true;
  };

  return (
    <TrialContext.Provider value={{ generations, upgrades, incrementGenerations, incrementUpgrades, limitReached }}>
      {children}
    </TrialContext.Provider>
  );
};

const useTrial = () => {
  const context = useContext(TrialContext);
  if (!context) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  return context;
};

const examplePrompts = [
  'A portfolio website for a photographer.',
  'A landing page for a new mobile app.',
  'A blog for a travel writer.',
  'An e-commerce site for handmade jewelry.',
];

function TryPageInner() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { generations, upgrades, incrementGenerations, limitReached } = useTrial();

  const onGenerate = (text?: string) => {
    if (!incrementGenerations()) return;

    const textToProcess = text || prompt;
    if (!textToProcess) {
      toast({
        title: 'Prompt is empty',
        description: 'Please describe the website you want to create.',
        variant: 'destructive',
      });
      return;
    }

    if (!text) {
      setPrompt(textToProcess);
    }

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
      }
    });
  };

  const handleRestart = () => {
    setPrompt('');
    setOutput('');
  }

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
              Try Monochrome AI
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Generate up to 5 websites and make 5 edits. No account needed.
            </p>
          </div>
          <Card className="mt-4 bg-accent/50 border-accent">
            <CardContent className="p-4 flex items-center justify-center gap-4 text-sm">
                <Info className="w-5 h-5 text-accent-foreground" />
                <p className="text-accent-foreground">
                    Generations left: <span className="font-bold">{MAX_GENERATIONS - generations}</span>
                </p>
                <p className="text-accent-foreground">
                    Edits left: <span className="font-bold">{MAX_UPGRADES - upgrades}</span>
                </p>
            </CardContent>
          </Card>
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
                  disabled={isPending || generations >= MAX_GENERATIONS}
                  aria-label="Website Description Input"
                />
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <Button
                  onClick={() => onGenerate()}
                  disabled={isPending || generations >= MAX_GENERATIONS}
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
                          setPrompt(example);
                          onGenerate(example);
                        }}
                        disabled={isPending || generations >= MAX_GENERATIONS}
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
            <TrialAiChat />
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Monochrome Ai. All rights reserved.
        </p>
      </footer>
       <AlertDialog open={limitReached}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You've reached the limit!</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free generations and edits for this session. Please create an account to continue building amazing websites.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link href="/signup" passHref>
              <AlertDialogAction>Sign Up</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


const TrialAiChat = () => {
    const { upgrades, incrementUpgrades } = useTrial();
    
    // This is a wrapper around the real AiChat that passes a custom handler
    // to intercept the send message action and check trial limits.
    
    return <AiChat onSendMessage={incrementUpgrades} disabled={upgrades >= MAX_UPGRADES} />
}


export default function TryPage() {
    return (
        <TrialProvider>
            <TryPageInner />
        </TrialProvider>
    );
}
