
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, File, FileType2, Palette, Braces } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SavedFile {
  name: string;
  language: string;
  content: string;
}

interface SavedWork {
  files: SavedFile[];
  timestamp: string;
}

const fileIcons: { [key: string]: React.ReactNode } = {
  html: <FileType2 className="w-4 h-4" />,
  css: <Palette className="w-4 h-4" />,
  js: <Braces className="w-4 h-4" />,
  default: <File className="w-4 h-4" />,
};

const FileIcon = ({ filename }: { filename: string }) => {
  const extension = filename.split('.').pop() || '';
  return fileIcons[extension] || fileIcons.default;
};

export default function MyArchivePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [savedWork, setSavedWork] = useState<SavedWork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<SavedFile | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/my-archive');
    }
    if (user) {
      try {
        const data = localStorage.getItem(`monostudio-archive-${user.uid}`);
        if (data) {
          const parsedData = JSON.parse(data);
          setSavedWork(parsedData);
          if(parsedData.files.length > 0) {
              setActiveFile(parsedData.files[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load saved work from localStorage', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);

   useEffect(() => {
    if (savedWork) {
      const htmlFile = savedWork.files.find((f) => f.name.endsWith('.html'));
      const cssFile = savedWork.files.find((f) => f.name.endsWith('.css'));
      const jsFile = savedWork.files.find((f) => f.name.endsWith('.js'));

      if (!htmlFile) {
        setPreviewContent('<html><body>No index.html file found.</body></html>');
        return;
      }
      
      let processedHtml = htmlFile.content;

      if (cssFile) {
          processedHtml = processedHtml.replace('</head>', `<style>${cssFile.content}</style></head>`);
      }
      if (jsFile) {
          processedHtml = processedHtml.replace('</body>', `<script>${jsFile.content}<\/script></body>`);
      }
      
      setPreviewContent(processedHtml);
    }
  }, [savedWork]);


  if (loading || isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4 flex-1 pt-24">
        <header className="mb-8">
            <Skeleton className="h-10 w-2/3 md:w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2 md:w-1/2" />
        </header>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/5" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-64 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!savedWork) {
    return (
        <div className="container mx-auto max-w-2xl py-8 px-4 flex-1 pt-24 text-center">
            <Card className="p-8">
                <CardTitle>No Saved Work Found</CardTitle>
                <CardDescription className="mt-2">
                    You haven't saved any projects yet. Go to the editor to start creating!
                </CardDescription>
                <Link href="/create" className='mt-6 inline-block'>
                    <Button>
                        Start Coding
                    </Button>
                </Link>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-display">My Archive</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your last saved project. Last saved{' '}
          {formatDistanceToNow(new Date(savedWork.timestamp), { addSuffix: true })}.
        </p>
      </header>
      <Card className="overflow-hidden">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="min-h-[600px]">
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="p-2 h-full bg-background/50">
              <h2 className="text-sm font-semibold mb-2 px-2">Files</h2>
              <ScrollArea className="h-full">
                {savedWork.files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file)}
                    className={cn(
                      'w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center gap-2',
                      activeFile?.name === file.name
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <FileIcon filename={file.name} />
                    {file.name}
                  </button>
                ))}
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <TabsList className="m-2">
                <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2" />Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="flex-1 bg-white m-2 mt-0 rounded-md border">
                <iframe
                    srcDoc={previewContent}
                    title="Preview"
                    sandbox="allow-scripts"
                    className="w-full h-full"
                />
              </TabsContent>
              <TabsContent value="code" className="flex-1 m-2 mt-0 rounded-md border relative">
                  <ScrollArea className='h-full'>
                    <pre className="p-4 text-sm whitespace-pre-wrap">
                        <code>{activeFile?.content || "Select a file to view its code"}</code>
                    </pre>
                  </ScrollArea>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </div>
  );
}
