
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Search, CheckCircle, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

const initialPlugins = [
  { id: 'ai-code-assistant', name: 'AI Code Assistant', description: 'Get AI-powered code suggestions and completions.', version: '1.2.0', apiKey: '', connected: false },
  { id: 'live-db-connector', name: 'Live Database Connector', description: 'Connect to a live database for dynamic content.', version: '0.8.5', apiKey: '', connected: false },
  { id: 'theme-pack', name: 'Theme Pack', description: 'A collection of additional themes for your editor.', version: '2.0.1', apiKey: null, connected: true }, // No API key needed
  { id: 'deployment-helper', name: 'Deployment Helper', description: 'Easily deploy your project to various platforms.', version: '1.5.0', apiKey: '', connected: false },
];

export default function PluginsPage() {
  const [plugins, setPlugins] = useState(initialPlugins);
  const { toast } = useToast();

  const handleApiKeyChange = (id: string, value: string) => {
    setPlugins(plugins.map(p => p.id === id ? { ...p, apiKey: value } : p));
  };

  const handleSave = (id: string) => {
    const plugin = plugins.find(p => p.id === id);
    if (plugin && plugin.apiKey === '') {
        toast({ title: "API Key Required", description: "Please enter an API key to connect the plugin.", variant: "destructive" });
        return;
    }
    setPlugins(plugins.map(p => p.id === id ? { ...p, connected: true } : p));
    toast({ title: "Plugin Connected", description: `${plugin?.name} has been successfully connected.` });
  };


  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-display flex items-center gap-3">
            <Plug className='w-10 h-10' />
            Plugins
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Extend the functionality of Mono Studio with plugins.
        </p>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search plugins..." className="pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <Card key={plugin.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plugin.name}</CardTitle>
              <CardDescription>{plugin.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               {plugin.apiKey !== null && !plugin.connected && (
                 <div className="space-y-2">
                    <Label htmlFor={`api-key-${plugin.id}`} className="flex items-center gap-2 text-xs text-muted-foreground"><KeyRound className="w-3 h-3" /> API Key</Label>
                    <Input 
                        id={`api-key-${plugin.id}`}
                        type="password"
                        placeholder="Enter your API key"
                        value={plugin.apiKey}
                        onChange={(e) => handleApiKeyChange(plugin.id, e.target.value)}
                    />
                 </div>
               )}
               {plugin.connected && (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-2 rounded-md">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
               )}
            </CardContent>
            <CardFooter className='flex justify-between items-center'>
                <span className='text-xs text-muted-foreground'>v{plugin.version}</span>
                {plugin.apiKey !== null && !plugin.connected && (
                     <Button onClick={() => handleSave(plugin.id)}>Save & Connect</Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
       <Card className="mt-8 text-center p-8 bg-muted/30">
            <CardTitle>More plugins coming soon!</CardTitle>
            <CardDescription className="mt-2">
                The plugin marketplace is under construction. Check back later for more ways to enhance your editor.
            </CardDescription>
        </Card>
    </div>
  );
}
