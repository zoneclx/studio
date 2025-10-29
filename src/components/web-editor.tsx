
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
  Settings,
  Sparkles,
  HardHat,
  Loader2,
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';


const Logo = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold font-display">Byte Studio</span>
            </div>
        );
    }
    
    if (theme === 'redhat') {
        return (
            <div className="flex items-center gap-2">
                <Terminal className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold font-display">Byte Studio</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold font-display">Byte Studio</span>
        </div>
    );
};

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
  const isMobile = useIsMobile();

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [files, setFiles] = useState(defaultFiles);
  const [activeFile, setActiveFile] = useState(defaultFiles[0].name);
  const [previewContent, setPreviewContent] = useState('');
  
  const [isShareOpen, setShareOpen] = useState(false);
  const [isSaveOpen, setSaveOpen] = useState(false);
  const [isNewFileOpen, setNewFileOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  const [mobileView, setMobileView] = useState<'files' | 'editor' | 'preview' | 'terminal' | 'ai-chat'>('editor');
  const [activeSidePanel, setActiveSidePanel] = useState<'files' | 'ai-chat'>('files');
  const [isTerminalVisible, setTerminalVisible] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);

  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Welcome to Byte Studio Terminal (simulation)...', '> Logs from your script will appear here.']);
  const [terminalInput, setTerminalInput] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    const editingId = searchParams.get('edit');
    if (editingId) {
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
        window.addEventListener('error', function(event) {
          window.parent.postMessage({ type: 'console', message: 'ERROR: ' + event.message }, '*');
        });
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
      let projects: Project[] = storedProjectsStr ? JSON.parse(storedProjectsStr) : [];
      
      const newTimestamp = new Date().toISOString();
      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex !== -1) { // Updating existing project
          projects[projectIndex] = { ...projects[projectIndex], name: projectName, files, timestamp: newTimestamp };
      } else { // Saving new project or a loaded one that wasn't in the list
          const newProjectId = projectId || `proj-${Date.now()}`;
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

  const handleTerminalCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || isInstalling) return;

    const command = terminalInput.trim();
    const newOutput = [...terminalOutput, `> ${command}`];
    setTerminalOutput(newOutput);
    setTerminalInput('');

    if (command.toLowerCase() === 'clear') {
      setTerminalOutput(['> Terminal cleared.']);
    } else if (command.toLowerCase() === 'npm install') {
      setIsInstalling(true);
      
      const installSteps = [
        "Resolving packages...",
        "Fetching packages...",
        "Linking dependencies...",
        "up to date, audited 23 packages in 1s",
        "3 packages are looking for funding",
        "  run `npm fund` for details",
        "found 0 vulnerabilities",
        "Installation complete."
      ];

      for (const step of installSteps) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
        setTerminalOutput(prev => [...prev, step]);
      }

      setIsInstalling(false);
    } else if (command) {
      setTerminalOutput(prev => [...prev, `-bash: command not found: ${command}`]);
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

  const renderFilesView = (isForMobile: boolean) => (
    <div className="p-2 h-full bg-card/50 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-2 px-2 pt-2 shrink-0">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Explorer</h2>
            <Dialog open={isNewFileOpen} onOpenChange={setNewFileOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
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
              onClick={() => isForMobile ? handleSelectFileMobile(file.name) : setActiveFile(file.name)}
              className={cn(
                'w-full text-left p-2 rounded-md flex items-center gap-2 text-sm',
                 activeFile === file.name
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              )}
            >
              <FileIcon filename={file.name} />
              <span className='truncate'>{file.name}</span>
            </button>
          ))}
        </ScrollArea>
    </div>
  );

  const renderEditorView = () => (
    <Tabs value={activeFile} onValueChange={setActiveFile} className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between border-b shrink-0 h-10">
            <ScrollArea className="h-10">
                <TabsList className="h-10 bg-transparent p-0 rounded-none border-0">
                {files.map((file) => (
                    <TabsTrigger 
                        key={file.name} 
                        value={file.name} 
                        className="h-10 text-sm flex items-center gap-1.5 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-accent/50"
                    >
                        <FileIcon filename={file.name} /> 
                        {file.name}
                    </TabsTrigger>
                ))}
                </TabsList>
            </ScrollArea>
            <div className="flex items-center gap-2 px-4">
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
                                    <Label htmlFor="project-name" className="text-right">Project Name</Label>
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
                                <DialogDescription>Enter the email of the person you want to share this project with.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
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
            </div>
        </div>
        <TabsContent value={activeFile} className="flex-1 p-0 m-0">
            <Textarea
                value={currentFile?.content || ''}
                onChange={(e) => handleFileChange(activeFile, e.target.value)}
                placeholder="Start coding..."
                className="w-full h-full resize-none border-0 rounded-none font-mono text-sm bg-background focus-visible:ring-0"
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
     <div className="h-full flex-1 flex flex-col bg-background font-mono text-sm">
        <header className="h-10 border-b flex items-center px-4 shrink-0">
            <h2 className="font-semibold text-sm uppercase tracking-wider">Terminal</h2>
        </header>
        <ScrollArea className="flex-1 p-4">
            {terminalOutput.map((line, index) => (
                <div key={index} className="flex">
                    <span className='text-muted-foreground mr-2'>{line.startsWith('>') ? '' : ' '}</span>
                    <p className="whitespace-pre-wrap">{line}</p>
                </div>
            ))}
            {isInstalling && <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> <span>Running...</span></div>}
        </ScrollArea>
        <div className="flex items-center gap-2 p-2 border-t">
            <span className='text-muted-foreground'>></span>
            <Input 
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalCommand}
                className="bg-transparent border-none text-foreground w-full p-0 h-auto focus-visible:ring-0"
                placeholder="Type a command..."
                disabled={isInstalling}
            />
        </div>
    </div>
  );

  const UnderDevView = () => (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit border border-primary/20 mb-2">
            <HardHat className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            The AI Assistant is currently under development. Check back later!
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderAiChatView = () => (
    <div className="h-full bg-card/80">
      <header className="flex items-center gap-2 p-3 border-b h-14">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
      </header>
      <UnderDevView />
    </div>
  );

  const renderSidePanelContent = () => {
    if (activeSidePanel === 'files') {
        return renderFilesView(false);
    }
    if (activeSidePanel === 'ai-chat') {
        return renderAiChatView();
    }
    return null;
  }
  
  // Mobile UI
  if (isMobile) {
    return (
      <div className="flex h-full w-full flex-col">
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0">
            <Link href="/dashboard">
                <Logo />
            </Link>
            <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings className="w-5 h-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editor Settings</DialogTitle>
                        <DialogDescription>Customize your development environment.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                    <div className="flex items-center justify-between">
                        <Label>Theme</Label>
                        <ThemeToggle />
                    </div>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
        <div className="flex-1 pb-14 overflow-y-auto">
          {mobileView === 'files' && renderFilesView(true)}
          {mobileView === 'editor' && renderEditorView()}
          {mobileView === 'preview' && renderPreviewView()}
          {mobileView === 'terminal' && renderTerminalView()}
          {mobileView === 'ai-chat' && <UnderDevView />}
        </div>
        <MobileEditorNav activeView={mobileView} setView={setMobileView} />
      </div>
    );
  }

  // Desktop UI (VS Code style)
  return (
    <div className="h-screen w-full flex flex-col">
        {/* Top Navbar */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0 z-20">
            <Link href="/dashboard">
                <Logo />
            </Link>
            {/* Can add more nav items here if needed */}
        </header>
        
        {/* Editor Layout */}
        <div className="flex flex-1 min-h-0">
            <TooltipProvider>
                <div className="flex h-full w-full bg-background text-foreground">
                    {/* Activity Bar */}
                    <div className="w-12 bg-card border-r flex flex-col items-center justify-between py-2">
                        <div className="flex flex-col gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn('w-9 h-9', activeSidePanel === 'files' && 'bg-accent text-accent-foreground')}
                                        onClick={() => setActiveSidePanel('files')}
                                    >
                                        <File className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Files</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn('w-9 h-9', activeSidePanel === 'ai-chat' && 'bg-accent text-accent-foreground')}
                                        onClick={() => setActiveSidePanel('ai-chat')}
                                        disabled
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">AI Assistant (Coming Soon)</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn('w-9 h-9', isTerminalVisible && 'bg-accent text-accent-foreground')}
                                        onClick={() => setTerminalVisible(v => !v)}
                                    >
                                        <Terminal className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Terminal</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={cn('w-9 h-9', isPreviewVisible && 'bg-accent text-accent-foreground')}
                                        onClick={() => setPreviewVisible(v => !v)}
                                    >
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Preview</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="w-9 h-9">
                                                <Settings className="w-5 h-5" />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Settings</TooltipContent>
                                </Tooltip>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Editor Settings</DialogTitle>
                                        <DialogDescription>Customize your development environment.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Theme</Label>
                                        <ThemeToggle />
                                    </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    
                    {/* Main Layout */}
                    <ResizablePanelGroup direction="horizontal" className="flex-1">
                    {/* Side Panel */}
                    <ResizablePanel defaultSize={15} minSize={10} maxSize={30}>
                        <div className='h-full bg-card/80 border-r'>
                            {renderSidePanelContent()}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />

                    {/* Editor and Terminal */}
                    <ResizablePanel defaultSize={55}>
                        <ResizablePanelGroup direction="vertical">
                            <ResizablePanel defaultSize={100} minSize={30}>
                                {renderEditorView()}
                            </ResizablePanel>
                            {isTerminalVisible && (
                                <>
                                <ResizableHandle withHandle />
                                <ResizablePanel defaultSize={30} minSize={10} collapsible>
                                    {renderTerminalView()}
                                </ResizablePanel>
                                </>
                            )}
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    
                    {isPreviewVisible && (
                        <>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30} minSize={20} collapsible>
                            <div className="h-full bg-background">
                                <header className="h-10 border-b flex items-center px-4">
                                    <h2 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </h2>
                                </header>
                                <div className="h-[calc(100%-2.5rem)]">
                                    {renderPreviewView()}
                                 </div>
                            </div>
                        </ResizablePanel>
                        </>
                    )}
                    </ResizablePanelGroup>
                </div>
            </TooltipProvider>
        </div>
    </div>
  );
}

    

    
