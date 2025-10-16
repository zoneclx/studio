
'use client';

import { useState, useMemo } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  File,
  Play,
  Save,
  Share2,
  FileType2,
  Palette,
  Braces,
  Eye,
  PlusCircle,
} from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const initialFiles = [
  {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html>
<head>
    <title>My Awesome Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to your new site, coded in Mono Studio.</p>
    <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: 'style.css',
    language: 'css',
    content: `body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #f0f2f5;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}
h1 {
    color: #007aff;
    font-size: 3rem;
}`,
  },
  {
    name: 'script.js',
    language: 'javascript',
    content: `console.log('Hello from Mono Studio!');`,
  },
];

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

export default function WebEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0].name);
  const [previewContent, setPreviewContent] = useState('');
  const [isShareOpen, setShareOpen] = useState(false);
  const [isNewFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const playSound = useSound();

  const handleFileChange = (fileName: string, newContent: string) => {
    setFiles(
      files.map((file) =>
        file.name === fileName ? { ...file, content: newContent } : file
      )
    );
  };

  const runPreview = () => {
    playSound('success');
    const htmlFile = files.find((f) => f.name.endsWith('.html'));
    const cssFile = files.find((f) => f.name.endsWith('.css'));
    const jsFile = files.find((f) => f.name.endsWith('.js'));

    if (!htmlFile) {
      setPreviewContent(
        '<html><body>No index.html file found.</body></html>'
      );
      return;
    }

    let processedHtml = htmlFile.content;

    if (cssFile) {
      processedHtml = processedHtml.replace(
        '</head>',
        `<style>${cssFile.content}</style></head>`
      );
    }
    if (jsFile) {
      processedHtml = processedHtml.replace(
        '</body>',
        `<script>${jsFile.content}<\/script></body>`
      );
    }

    setPreviewContent(processedHtml);
  };

  const saveWork = () => {
    playSound('save');
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to save your work.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const savedWork = {
        files,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`monostudio-archive-${user.uid}`, JSON.stringify(savedWork));
      toast({
        title: 'Work Saved!',
        description: 'Your files have been saved to your archive.',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Could not save your work. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
     // Simulation: In a real app, this would generate a unique link or send an invite
    toast({
        title: "Project Shared!",
        description: "Your project has been shared successfully (simulation)."
    });
    setShareOpen(false);
  }

  const handleCreateFile = () => {
    if (!newFileName || !newFileName.includes('.')) {
        toast({ title: 'Invalid Filename', description: 'Please enter a valid filename with an extension (e.g., "new.js").', variant: 'destructive' });
        return;
    }
    if (files.some(f => f.name === newFileName)) {
        toast({ title: 'File Exists', description: 'A file with this name already exists.', variant: 'destructive' });
        return;
    }

    const extension = newFileName.split('.').pop() || '';
    const language = ['html', 'css', 'js'].includes(extension) ? extension : 'plaintext';
    
    let content = '';
    if (language === 'html') content = '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n\n</body>\n</html>';
    if (language === 'css') content = '/* New CSS File */';
    if (language === 'js') content = '// New JavaScript File';
    
    const newFile = { name: newFileName, language, content };
    setFiles([...files, newFile]);
    setActiveFile(newFileName);
    setNewFileName('');
    setNewFileOpen(false);
    toast({ title: 'File Created', description: `Successfully created ${newFileName}.` });
  };

  const currentFile = useMemo(
    () => files.find((f) => f.name === activeFile),
    [files, activeFile]
  );

  return (
    <div className="flex h-full flex-col pt-16">
      <header className="h-12 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Tabs value={activeFile} onValueChange={setActiveFile}>
            <TabsList className="h-8">
              {files.map((file) => (
                <TabsTrigger key={file.name} value={file.name} className="h-7 text-xs flex items-center gap-1.5">
                   <FileIcon filename={file.name} /> {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={runPreview}>
            <Play className="w-4 h-4 mr-2" /> Run
          </Button>
          <Button variant="ghost" size="sm" onClick={saveWork}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Dialog open={isShareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share Project</DialogTitle>
                    <DialogDescription>
                        Enter the email of the person you want to share this project with.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                        Email
                        </Label>
                        <Input id="email" type="email" placeholder="friend@example.com" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleShare}>Share</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel
          defaultSize={15}
          minSize={10}
          className="min-w-[150px] flex flex-col"
        >
          <div className="p-2 h-full bg-background/50 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2 px-2">
                 <h2 className="text-sm font-semibold">Explorer</h2>
                 <Dialog open={isNewFileOpen} onOpenChange={setNewFileOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <PlusCircle className="w-4 h-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New File</DialogTitle>
                            <DialogDescription>Enter a name for your new file, including the extension (e.g., .html, .css, .js).</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="filename" className="text-right">Filename</Label>
                                <Input id="filename" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className="col-span-3" placeholder="e.g., contact.html" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button onClick={handleCreateFile}>Create File</Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
            </div>
            <ScrollArea className="h-full">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={cn(
                    'w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center gap-2',
                    activeFile === file.name
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
        <ResizablePanel defaultSize={55}>
          <Tabs value="editor" className="h-full flex flex-col">
            <TabsContent value="editor" className="flex-1 p-0 m-0">
              <Textarea
                value={currentFile?.content || ''}
                onChange={(e) => handleFileChange(activeFile, e.target.value)}
                placeholder="Start coding..."
                className="w-full h-full resize-none border-0 rounded-none font-mono text-sm bg-transparent focus-visible:ring-0"
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="m-2">
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="preview"
              className="flex-1 bg-white m-2 rounded-md border"
            >
              <iframe
                srcDoc={previewContent}
                title="Preview"
                sandbox="allow-scripts"
                className="w-full h-full"
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
