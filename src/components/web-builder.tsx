
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Code, Eye, AlertTriangle, RefreshCw, Save, Share2, Info } from 'lucide-react';
import { handleGeneration } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import { useSound } from '@/hooks/use-sound';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { cn } from '@/lib/utils';

type WebBuilderProps = {
  mode: 'pro' | 'trial';
};

const TRIAL_LIMITS = {
  generations: 5,
  edits: 5,
  resetHours: 24,
};

const examplePrompts = [
  "A modern landing page for a SaaS company called 'Innovatech'.",
  "A portfolio website for a photographer named Jane Doe.",
  "A simple blog layout with a clean, minimalist design.",
  "A product launch page for a new smart watch.",
];

type Output = {
  html: string;
  css: string;
  javascript: string;
};

export default function WebBuilder({ mode }: WebBuilderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const playSound = useSound();

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<Output | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  // Trial state
  const [trialUses, setTrialUses] = useState({ generations: 0, lastReset: Date.now() });
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    if (initialPrompt) {
      setPrompt(decodeURIComponent(initialPrompt));
      handleGenerate(decodeURIComponent(initialPrompt));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (mode === 'trial') {
      try {
        const storedLimits = localStorage.getItem('monochrome-trial-limits');
        if (storedLimits) {
          const parsed = JSON.parse(storedLimits);
          const hoursSinceReset = (Date.now() - parsed.lastReset) / (1000 * 60 * 60);
          if (hoursSinceReset > TRIAL_LIMITS.resetHours) {
            // Reset limits
            localStorage.removeItem('monochrome-trial-limits');
            setTrialUses({ generations: 0, lastReset: Date.now() });
          } else {
            setTrialUses(parsed);
          }
        }
      } catch (e) {
        console.error("Could not read trial limits from localStorage", e);
      }
    }
  }, [mode]);

  const checkTrialLimit = useCallback(() => {
    if (mode !== 'trial') return true;
    
    if (trialUses.generations >= TRIAL_LIMITS.generations) {
      setShowLimitDialog(true);
      return false;
    }
    return true;
  }, [mode, trialUses]);
  
  const incrementTrialUsage = useCallback(() => {
    if (mode === 'trial') {
      const newUses = { ...trialUses, generations: trialUses.generations + 1 };
      setTrialUses(newUses);
      try {
        localStorage.setItem('monochrome-trial-limits', JSON.stringify(newUses));
      } catch (e) {
        console.error("Could not save trial limits to localStorage", e);
      }
    }
  }, [mode, trialUses]);

  const handleGenerate = async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
      toast({ title: 'Prompt is empty', description: 'Please describe the website you want to create.', variant: 'destructive' });
      return;
    }

    if (!checkTrialLimit()) return;

    setIsLoading(true);
    setIsPanelCollapsed(false);
    setOutput(null); // Clear previous output
    playSound('start');

    const result = await handleGeneration(currentPrompt);

    setIsLoading(false);
    if (result.success && result.data) {
      setOutput(result.data);
      toast({ title: 'Website Generated!', description: 'Your new website is ready for preview.' });
      playSound('success');
      if (mode === 'trial') incrementTrialUsage();
    } else {
      toast({ title: 'Generation Failed', description: result.error, variant: 'destructive' });
      playSound('error');
    }
  };
  
  const handleSave = () => {
    if (!output || !user) {
        toast({ title: "Nothing to save", description: "Generate a website first before saving.", variant: "destructive" });
        return;
    }
    
    const workToSave = {
      ...output,
      prompt: prompt,
      date: new Date().toISOString(),
    };

    try {
        localStorage.setItem(`monochrome-work-${user.uid}`, JSON.stringify(workToSave));
        toast({ title: "Work Saved!", description: "Your website has been saved to your archive." });
        playSound('save');
    } catch(e) {
        console.error("Failed to save to localStorage", e);
        toast({ title: "Save Failed", description: "Could not save your work to the browser storage.", variant: "destructive" });
    }
  };

  const fullHtml = useMemo(() => {
    if (!output) return '';
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; }
          ${output.css}
        </style>
      </head>
      <body>
        ${output.html}
        <script>
          ${output.javascript}
        </script>
      </body>
      </html>
    `;
  }, [output]);

  const remainingGenerations = TRIAL_LIMITS.generations - trialUses.generations;

  return (
    <>
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className={`grid grid-cols-1 ${isPanelCollapsed ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8 transition-all duration-300`}>
          {/* --- Generation Panel --- */}
          <div className={cn("flex flex-col gap-8", { 'lg:hidden': isPanelCollapsed })}>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-display">
                  <Wand2 className="w-6 h-6" />
                  Website Generator
                </CardTitle>
                <CardDescription>
                  Describe the website you want to create. Be as specific as you like.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., A modern landing page for a SaaS company..."
                  className="min-h-[150px] text-base"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="space-y-2">
                    <p className="text-sm font-medium">Example Prompts:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((p, i) => (
                            <Button key={i} variant="outline" size="sm" onClick={() => setPrompt(p)}>{p}</Button>
                        ))}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col sm:flex-row gap-2">
                <Button
                  size="lg"
                  onClick={() => handleGenerate(prompt)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
                {mode === 'trial' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
                        <Info className="w-4 h-4"/>
                        <span>{remainingGenerations} generations remaining today.</span>
                    </div>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* --- Output Panel --- */}
          <div className={cn("transition-all duration-300", { 'lg:col-span-2': isPanelCollapsed })}>
            <Card className="h-full">
              <Tabs defaultValue="preview" className="flex flex-col h-full">
                <div className="flex items-center p-2 border-b">
                  <TabsList>
                    <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2" />Preview</TabsTrigger>
                    <TabsTrigger value="code"><Code className="w-4 h-4 mr-2" />Code</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                     {output && mode === 'pro' && (
                       <Button variant="ghost" size="sm" onClick={handleSave}>
                         <Save className="w-4 h-4 mr-2" /> Save
                       </Button>
                     )}
                     {output && (
                       <Button variant="ghost" size="sm" onClick={() => handleGenerate(prompt)}>
                         <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                       </Button>
                     )}
                  </div>
                </div>

                <TabsContent value="preview" className="flex-1 mt-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted rounded-b-md">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-lg font-medium">Generating your website...</p>
                      <p className="text-muted-foreground">This may take a moment.</p>
                    </div>
                  ) : output ? (
                    <iframe
                      srcDoc={fullHtml}
                      className="w-full h-[600px] border-0 bg-white rounded-b-md"
                      title="Website Preview"
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted rounded-b-md">
                      <Wand2 className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold">Your Website Will Appear Here</h3>
                      <p className="text-muted-foreground mt-2">Enter a prompt and click "Generate" to see the magic happen.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="code" className="flex-1 mt-0 bg-muted rounded-b-md">
                   {isLoading ? (
                        <div className="p-4 space-y-4">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : output ? (
                    <Tabs defaultValue="html" className="flex flex-col h-full">
                        <div className="p-2">
                          <TabsList>
                            <TabsTrigger value="html">HTML</TabsTrigger>
                            <TabsTrigger value="css">CSS</TabsTrigger>
                            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="html" className="flex-1 p-4 overflow-auto mt-0">
                            <pre className="text-sm whitespace-pre-wrap"><code>{output.html}</code></pre>
                        </TabsContent>
                         <TabsContent value="css" className="flex-1 p-4 overflow-auto mt-0">
                            <pre className="text-sm whitespace-pre-wrap"><code>{output.css}</code></pre>
                        </TabsContent>
                         <TabsContent value="javascript" className="flex-1 p-4 overflow-auto mt-0">
                            <pre className="text-sm whitespace-pre-wrap"><code>{output.javascript || '// No JavaScript generated'}</code></pre>
                        </TabsContent>
                    </Tabs>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <Code className="w-16 h-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">Generated Code Will Appear Here</h3>
                            <p className="text-muted-foreground mt-2">The HTML, CSS, and JavaScript for your site will be displayed here.</p>
                        </div>
                    )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Trial Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free website generations for today. Please sign up for a free account to continue creating and save your work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/signup')}>
              Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
