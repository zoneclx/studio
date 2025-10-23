
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Terminal,
  MessageSquare,
} from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
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
import { MobileNav } from './mobile-nav';
import { MobileEditorNav } from './mobile-editor-nav';
import AiChat from './ai-chat';
import WebBuilder from './web-builder';

const defaultFiles = [
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
  <p>This is a sample page.</p>
  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: 'style.css',
    language: 'css',
    content: `body {
  font-family: sans-serif;
  background-color: #f0f0f0;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

h1 {
  color: #007bff;
}`,
  },
  {
    name: 'script.js',
    language: 'javascript',
    content: `console.log('Hello from script.js!');
console.log('You can see this in the terminal.');`,
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

interface Project {
  id: string;
  name: string;
  files: { name: string; language: string; content: string }[];
  timestamp: string;
}

export default function WebEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [hasGenerated, setHasGenerated] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [files, setFiles] = useState(defaultFiles);
  const [activeFile, setActiveFile] = useState(defaultFiles[0].name);
  const [previewContent, setPreviewContent] = useState('');
  
  const [isShareOpen, setShareOpen] = useState(false);
  const [isSaveOpen, setSaveOpen] = useState(false);
  const [isNewFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'files' | 'editor' | 'preview' | 'ai-chat'>('files');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Welcome to Byte Studio Terminal (simulation)...', '> Logs from your script will appear here.']);
  const [terminalInput, setTerminalInput] = useState('');
  
  const handleGenerationComplete = (generatedFiles: { name: string; language: string; content: string }[]) => {
    setFiles(generatedFiles);
    setActiveFile(generatedFiles[0]?.name || '');
    setHasGenerated(true);
  };
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!user) return;
    const editingId = searchParams.get('edit');
    if (editingId) {
      setHasGenerated(true); // If we're editing, we can assume it was generated
      try {
        const storedProjectsStr = localStorage.getItem(`bytestudio-archive-${user.uid}`);
        if (storedProjectsStr) {
          const storedProjects: Project[] = JSON.parse(storedProjectsStr);
          const projectToEdit = storedProjects.find(p => p.id === editingId);
          if (projectToEdit) {
            setFiles(projectToEdit.files);
            setProjectId(projectToEdit.id);
            setProjectName(projectToEdit.name);
            setActiveFile(projectToEdit.files[0]?.name || '');
          }
        }
      } catch (error) {
        console.error('Failed to load project for editing:', error);
        toast({ title: "Load Error", description: "Could not load the project.", variant: 'destructive'});
        router.push('/create');
      }
    }
  }, [searchParams, user, router, toast]);

  const handleFileChange = (fileName: string, newContent: string) => {
    setFiles(
      files.map((file) =>
        file.name === fileName ? { ...file, content: newContent } : file
      )
    );
  };
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== (document.querySelector('iframe')?.contentWindow)) {
          return;
      }
      const { type, message } = event.data;
      if (type === 'console') {
        setTerminalOutput(prev => [...prev, message]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const runPreview = () => {
    const htmlFile = files.find((f) => f.name.endsWith('.html'));
    const cssFile = files.find((f) => f.name.endsWith('.css'));
    const jsFile = files.find((f) => f.name.endsWith('.js'));

    if (!htmlFile || !htmlFile.content) {
      setPreviewContent(
        '<html><body>No HTML file found. Create an index.html to see a preview.</body></html>'
      );
      return;
    }

    const consoleInterceptor = `
      <script>
        const originalLog = console.log;
        console.log = (...args) => {
          originalLog(...args);
          window.parent.postMessage({ type: 'console', message: args.map(arg => JSON.stringify(arg)).join(' ') }, '*');
        };
      </script>
    `;

    let processedHtml = htmlFile.content.replace('</head>', `${consoleInterceptor}</head>`);

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

  useEffect(() => {
    runPreview();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const saveWork = () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to save your work.',
        variant: 'destructive',
      });
      return;
    }
    if (!projectName.trim()) {
        toast({ title: 'Project Name Required', description: 'Please enter a name for your project.', variant: 'destructive'});
        return;
    }

    try {
      const storageKey = `bytestudio-archive-${user.uid}`;
      const storedProjectsStr = localStorage.getItem(storageKey);
      const projects: Project[] = storedProjectsStr ? JSON.parse(storedProjectsStr) : [];
      
      const newTimestamp = new Date().toISOString();

      if (projectId) { // Updating existing project
        const projectIndex = projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          projects[projectIndex] = { ...projects[projectIndex], name: projectName, files, timestamp: newTimestamp };
        }
      } else { // Saving new project
        const newProjectId = `proj-${Date.now()}`;
        const newProject: Project = {
          id: newProjectId,
          name: projectName,
          files,
          timestamp: newTimestamp
        };
        projects.push(newProject);
        setProjectId(newProjectId);
      }

      localStorage.setItem(storageKey, JSON.stringify(projects));
      toast({
        title: 'Project Saved!',
        description: `${projectName} has been saved.`,
      });
      setSaveOpen(false);
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Could not save your work. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
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
    if (language === 'html') content = '<!DOCTYPE html>\\n<html>\\n<head>\\n  <title>New Page</title>\\n</head>\\n<body>\\n\\n</body>\\n</html>';
    if (language === 'css') content = '/* New CSS File */';
    if (language === 'js') content = '// New JavaScript File';
    
    const newFile = { name: newFileName, language, content };
    setFiles([...files, newFile]);
    setActiveFile(newFileName);
    setNewFileName('');
    setNewFileOpen(false);
    toast({ title: 'File Created', description: `Successfully created ${newFileName}.` });
  };

  const handleTerminalCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = terminalInput.trim();
      const newOutput = [...terminalOutput, `> ${command}`];
      
      if (command.toLowerCase() === 'clear') {
        setTerminalOutput(['> Terminal cleared.']);
      } else if (command) {
        newOutput.push(`-bash: command not found: ${command}`);
        setTerminalOutput(newOutput);
      } else {
        setTerminalOutput(newOutput);
      }
      
      setTerminalInput('');
    }
  };

  const currentFile = useMemo(
    () => files.find((f) => f.name === activeFile),
    [files, activeFile]
  );
  
  const handleSaveClick = () => {
    if (!user) {
       toast({ title: 'Login Required', description: 'Please log in to save your project.', variant: 'destructive' });
       return;
    }
    setSaveOpen(true);
  }
  
  const editorActions = { runPreview, saveWork: handleSaveClick, handleShare: () => setShareOpen(true) };
  
  const handleSelectFileMobile = (fileName: string) => {
    setActiveFile(fileName);
    setMobileView('editor');
  };
  
   if (!hasGenerated) {
    return <WebBuilder onGenerationComplete={handleGenerationComplete} />;
  }

  const renderFilesView = () => (
    <div className="p-2 h-full bg-background/50 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-2 px-2 pt-2">
            <h2 className="text-lg font-semibold">Project Files</h2>
            <Dialog open={isNewFileOpen} onOpenChange={setNewFileOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="w-5 h-5" />
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
        <ScrollArea className="flex-1">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => handleSelectFileMobile(file.name)}
              className={cn(
                'w-full text-left text-base p-3 rounded-md flex items-center gap-3',
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
  );

  const renderEditorView = () => (
    <Tabs value={activeFile} onValueChange={setActiveFile} className="h-full flex flex-col">
        <header className="h-12 border-b flex items-center justify-between px-2 sm:px-4 shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
                <FileIcon filename={activeFile} />
                {activeFile}
            </h2>
            <div className="lg:hidden">
                <MobileNav actions={editorActions} />
            </div>
        </header>
        <TabsContent value={activeFile} className="flex-1 p-0 m-0">
            <Textarea
                value={currentFile?.content || ''}
                onChange={(e) => handleFileChange(activeFile, e.target.value)}
                placeholder="Start coding..."
                className="w-full h-full resize-none border-0 rounded-none font-mono text-sm bg-transparent focus-visible:ring-0"
            />
        </TabsContent>
    </Tabs>
  );

  const renderPreviewView = () => (
      <iframe
        srcDoc={previewContent}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full bg-white border-none"
      />
  );
  
  const renderTerminalView = () => (
     <div className="h-full flex-1 flex flex-col bg-black text-white font-mono text-sm">
        <ScrollArea className="flex-1 p-4">
            {terminalOutput.map((line, index) => (
                <p key={index} className="whitespace-pre-wrap">{line}</p>
            ))}
        </ScrollArea>
        <div className="flex items-center gap-2 p-2 border-t border-gray-700">
            <span>></span>
            <Input 
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalCommand}
                className="bg-transparent border-none text-white w-full p-0 h-auto focus-visible:ring-0"
                placeholder="Type a command..."
            />
        </div>
    </div>
  );

  const renderAiChatView = () => (
    <div className="h-full">
        <AiChat />
    </div>
  );

  return (
    <div className="flex h-full flex-col pt-16">
      <div className='flex-1 flex flex-col min-h-0'>
        {isMobile ? (
          <div className="flex-1 pb-14">
            {mobileView === 'files' && renderFilesView()}
            {mobileView === 'editor' && renderEditorView()}
            {mobileView === 'preview' && renderPreviewView()}
            {mobileView === 'ai-chat' && renderAiChatView()}
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel
            defaultSize={15}
            minSize={10}
            className="min-w-[200px] flex flex-col"
            >
            <div className="p-2 h-full bg-background/50 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 px-2">
                    <h2 className="text-sm font-semibold">Project Files</h2>
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
                <ScrollArea className="flex-1">
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
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={65}>
                        <Tabs value={activeFile} onValueChange={setActiveFile} className="h-full flex flex-col">
                            <header className="h-12 border-b flex items-center justify-between px-2 sm:px-4 shrink-0">
                                <TabsList className="h-8">
                                {files.map((file) => (
                                    <TabsTrigger key={file.name} value={file.name} className="h-7 text-xs flex items-center gap-1.5 px-2">
                                    <FileIcon filename={file.name} /> 
                                    <span className="hidden sm:inline">{file.name}</span>
                                    </TabsTrigger>
                                ))}
                                </TabsList>
                                <div className="hidden lg:flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={runPreview}>
                                    <Play className="w-4 h-4 mr-2" /> Run
                                </Button>
                                 <Dialog open={isSaveOpen} onOpenChange={setSaveOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" onClick={handleSaveClick}>
                                            <Save className="w-4 h-4 mr-2" /> Save
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Save Project</DialogTitle>
                                            <DialogDescription>
                                                Give your project a name. This will create a new project or update the existing one.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="project-name" className="text-right">
                                                Project Name
                                                </Label>
                                                <Input id="project-name" value={projectName} onChange={e => setProjectName(e.target.value)} className="col-span-3" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={saveWork}>Save Project</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
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
                                 <div className="lg:hidden">
                                    <MobileNav actions={editorActions} />
                                </div>
                            </header>
                            <TabsContent value={activeFile} className="flex-1 p-0 m-0">
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
                    <ResizablePanel defaultSize={35}>
                        {renderTerminalView()}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30}>
                 <Tabs defaultValue="preview" className="h-full flex flex-col">
                    <TabsList className="h-10 rounded-none bg-background/50 border-b p-1">
                        <TabsTrigger value="preview" className="h-8">
                            <Eye className="w-4 h-4 mr-2" /> Preview
                        </TabsTrigger>
                        <TabsTrigger value="ai-chat" className="h-8">
                            <MessageSquare className="w-4 h-4 mr-2" /> AI Chat
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="flex-1 m-0">
                        {renderPreviewView()}
                    </TabsContent>
                    <TabsContent value="ai-chat" className="flex-1 m-0">
                       {renderAiChatView()}
                    </TabsContent>
                </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
      {isMobile && <MobileEditorNav activeView={mobileView} setView={setMobileView} />}
    </div>
  );
}
