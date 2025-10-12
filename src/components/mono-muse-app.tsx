"use client";

import { useState, useTransition, useEffect } from "react";
import { Download, Share2, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { handleGeneration } from "@/app/actions";

const examplePrompts = [
  "A portfolio website for a photographer.",
  "A landing page for a new mobile app.",
  "A blog for a travel writer.",
  "An e-commerce site for handmade jewelry.",
];

export default function MonoMuseApp() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [canShare, setCanShare] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof navigator !== "undefined" && (navigator.share || navigator.clipboard)) {
      setCanShare(true);
    }
  }, []);

  const onGenerate = (text?: string) => {
    const textToProcess = text || prompt;
    if (!textToProcess) {
      toast({
        title: "Prompt is empty",
        description: "Please describe the website you want to create.",
        variant: "destructive",
      });
      return;
    }

    if (!text) {
      setPrompt(textToProcess);
    }
    
    setOutput("");
    startTransition(async () => {
      const result = await handleGeneration(textToProcess);
      if (result.error) {
        toast({
          title: "An error occurred",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setOutput(result.text || "");
      }
    });
  };

  const handleSave = () => {
    if (!output) return;
    try {
      const blob = new Blob([output], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "index.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      toast({
        title: "Save failed",
        description: "Could not save the file.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!output) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Website Generation",
          text: output,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error("Error sharing:", error);
        toast({
          title: "Sharing failed",
          description: "Could not share the generated code.",
          variant: "destructive",
        });
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(output);
        toast({
          title: "Copied to clipboard",
          description: "Share API not supported, code copied to clipboard.",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy code to clipboard.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-8 sm:py-12">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-headline">AI Web Builder</h1>
          <p className="text-muted-foreground mt-2 text-lg">Describe the website you want, and let AI build it for you.</p>
        </header>
        
        <div className="space-y-6">
          <div className="grid gap-4">
            <Textarea
              placeholder="e.g., 'A modern landing page for a SaaS product with a pricing table...'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-base rounded-md focus-visible:ring-primary bg-input border-border"
              disabled={isPending}
              aria-label="Website Description Input"
            />
            <Button onClick={() => onGenerate()} disabled={isPending} size="lg" className="w-full sm:w-auto justify-self-center sm:justify-self-end bg-primary text-primary-foreground hover:bg-primary/90">
              <Sparkles className="mr-2 h-4 w-4" />
              {isPending ? "Building..." : "Create Website"}
            </Button>
          </div>
          
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Or, try one of these ideas:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {examplePrompts.map((example, i) => (
                <Button key={i} variant="outline" size="sm" onClick={() => onGenerate(example)} disabled={isPending}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle>Website Code</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px] bg-muted/20 rounded-b-lg">
              {isPending ? (
                <div className="space-y-3 p-1">
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap animate-in fade-in duration-500 text-foreground/90 font-code text-sm">
                  <code>
                    {output || <p className="text-muted-foreground font-sans">Your generated website code will appear here.</p>}
                  </code>
                </pre>
              )}
            </CardContent>
            {output && !isPending && (
              <CardFooter className="justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="icon" onClick={handleSave} aria-label="Save code as an HTML file">
                  <Download className="h-4 w-4" />
                </Button>
                {canShare && (
                  <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share generated code">
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AI Web Builder. All rights reserved.</p>
      </footer>
    </div>
  );
}
