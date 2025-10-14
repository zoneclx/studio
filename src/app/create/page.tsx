
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Share2, Sparkles, Wand2, RefreshCw, Save, Code, Eye } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
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

const examplePrompts = [
  'A portfolio for a Product Designer',
  'A landing page for a new mobile app',
  'A blog for a travel writer',
  'An e-commerce site for handmade jewelry',
];

type WebsiteCode = {
  html: string;
};

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  const [prompt, setPrompt] = useState(initialPrompt);
  const [lastSuccessfulPrompt, setLastSuccessfulPrompt] = useState('');
  const [output, setOutput] = useState<WebsiteCode | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);
  
   useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator.share || navigator.clipboard)) {
      setCanShare(true);
    }
  }, []);

  const saveWork = (code: WebsiteCode | null, currentPrompt: string) => {
    if (user && code) {
      try {
        const work = {
          html: code.html,
          css: '', // included in html
          javascript: '', // included in html
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
  };

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
      setLastSuccessfulPrompt(textToProcess);
      if (saveWork(websiteCode, textToProcess)) {
        toast({
          title: 'Work Saved',
          description: 'Your creation has been automatically saved to your archive.',
        });
      }
    });
  };

  useEffect(() => {
    if (initialPrompt) {
      onGenerate(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);


  const handleAiChatMessage = async (text: string, image?: string) => {
    return handleChat(text, image);
  };

  const handleRestart = () => {
    if (lastSuccessfulPrompt) {
      onGenerate(lastSuccessfulPrompt);
    }
  };

  const handleSave = () => {
    if (saveWork(output, prompt)) {
      toast({ title: 'Work Saved', description: 'Your latest creation has been saved.' });
    } else {
      toast({ title: 'Save Failed', description: 'Could not save your work.', variant: 'destructive' });
    }
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

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen p-8">
        <Skeleton className="h-12 w-1/4 mb-8" />
        <Skeleton className="h-8 w-1/2 mb-8" />
        <div className="flex-1 grid grid-cols-1 gap-8">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-3xl mx-auto">
            Bring your ideas to life. Describe the website you want to build, and let our AI handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Your Vision
                </CardTitle>
                <CardDescription>
                  Use the text area below to describe your website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., 'A modern landing page for a SaaS product...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[180px] text-base rounded-md"
                  disabled={isPending}
                />
                <Button
                  onClick={() => onGenerate()}
                  disabled={isPending}
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
                  <CardDescription>Not sure where to start? Try one of these.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                  {examplePrompts.map((example, i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      onClick={() => onGenerate(example)}
                      disabled={isPending}
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
                             <CardDescription>Describe any changes you'd like to make.</CardDescription>
                         </CardHeader>
                         <CardContent className="p-0 h-[400px]">
                            <AiChat 
                                onSendMessage={handleAiChatMessage}
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
                      <Button variant="ghost" size="icon" onClick={handleRestart} title="Restart"><RefreshCw className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={handleSave} title="Save"><Save className="h-4 w-4" /></Button>
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
  );
}
