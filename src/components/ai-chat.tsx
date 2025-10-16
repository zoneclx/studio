
'use client';

import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Code, Eye, Play, Save, Share2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';

const initialFiles = [
    { name: 'index.html', language: 'html', content: `<!DOCTYPE html>
<html>
<head>
    <title>My Awesome Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <script src="script.js"></script>
</body>
</html>` },
    { name: 'style.css', language: 'css', content: `body {
    font-family: sans-serif;
    background-color: #f0f0f0;
}` },
    { name: 'script.js', language: 'javascript', content: `console.log('Hello from script.js!');` },
];

export default function WebEditor() {
    const [files, setFiles] = useState(initialFiles);
    const [activeFile, setActiveFile] = useState(initialFiles[0].name);
    const [previewContent, setPreviewContent] = useState('');
    const playSound = useSound();

    const handleFileChange = (fileName: string, newContent: string) => {
        setFiles(files.map(file => file.name === fileName ? { ...file, content: newContent } : file));
    };

    const runPreview = () => {
        playSound('success');
        const htmlFile = files.find(f => f.name.endsWith('.html'));
        const cssFile = files.find(f => f.name.endsWith('.css'));
        const jsFile = files.find(f => f.name.endsWith('.js'));

        if (!htmlFile) {
            setPreviewContent('<html><body>No index.html file found.</body></html>');
            return;
        }

        const combinedHtml = `
            <html>
                <head>
                    <style>${cssFile?.content || ''}</style>
                </head>
                <body>
                    ${htmlFile.content}
                    <script>${jsFile?.content || ''}<\/script>
                </body>
            </html>
        `;
        setPreviewContent(combinedHtml);
    };

    const currentFile = files.find(f => f.name === activeFile);

    return (
        <div className="flex h-full flex-col pt-16">
            <header className="h-12 border-b flex items-center justify-between px-4 shrink-0">
                 <div className="flex items-center gap-2">
                    <Tabs value={activeFile} onValueChange={setActiveFile}>
                        <TabsList className="h-8">
                            {files.map(file => (
                                <TabsTrigger key={file.name} value={file.name} className="h-7 text-xs">
                                    {file.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={runPreview}><Play className="w-4 h-4 mr-2" /> Run</Button>
                    <Button variant="ghost" size="sm"><Save className="w-4 h-4 mr-2" /> Save</Button>
                    <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                </div>
            </header>
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={15} minSize={10} className="min-w-[150px]">
                    <div className="p-4 h-full bg-background/50">
                        <h2 className="text-sm font-semibold mb-2">Explorer</h2>
                        <ScrollArea className="h-full">
                            {files.map(file => (
                                <button key={file.name} onClick={() => setActiveFile(file.name)} className={cn("w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center gap-2", activeFile === file.name ? "bg-muted" : "hover:bg-muted/50")}>
                                    <File className="w-4 h-4" />
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
                                className="w-full h-full resize-none border-0 rounded-none font-mono text-sm"
                            />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30}>
                    <Tabs defaultValue="preview" className="h-full flex flex-col">
                        <TabsList className="m-2">
                            <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2" />Preview</TabsTrigger>
                            <TabsTrigger value="code" disabled><Code className="w-4 h-4 mr-2" />Generated Code</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="flex-1 bg-white m-2 rounded-md border">
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

