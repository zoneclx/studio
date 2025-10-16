
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Search, CheckCircle, KeyRound, PowerOff, Power } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { usePlugins } from '@/context/plugin-context';

export default function PluginsPage() {
  const { plugins, updatePluginApiKey, connectPlugin, disconnectPlugin } = usePlugins();
  const { toast } = useToast();

  const handleSave = (id: string) => {
    const plugin = plugins.find(p => p.id === id);
    if (plugin && plugin.apiKeyRequired && !plugin.apiKey) {
        toast({ title: "API Key Required", description: "Please enter an API key to connect the plugin.", variant: "destructive" });
        return;
    }
    connectPlugin(id);
    toast({ title: "Plugin Connected", description: `${plugin?.name} has been successfully connected.` });
  };

  const handleDisconnect = (id: string) => {
    const plugin = plugins.find(p => p.id === id);
    disconnectPlugin(id);
    toast({ title: "Plugin Disconnected", description: `${plugin?.name} has been disconnected.`, variant: 'destructive'});
  }

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
               {plugin.apiKeyRequired && !plugin.connected && (
                 <div className="space-y-2">
                    <Label htmlFor={`api-key-${plugin.id}`} className="flex items-center gap-2 text-xs text-muted-foreground"><KeyRound className="w-3 h-3" /> API Key</Label>
                    <Input 
                        id={`api-key-${plugin.id}`}
                        type="password"
                        placeholder="Enter your API key"
                        value={plugin.apiKey}
                        onChange={(e) => updatePluginApiKey(plugin.id, e.target.value)}
                    />
                 </div>
               )}
               {plugin.connected && (
                  <div className="flex items-center justify-between gap-2 text-green-500 bg-green-500/10 p-2 rounded-md">
                    <div className='flex items-center gap-2'>
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Connected</span>
                    </div>
                    {plugin.apiKeyRequired && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-500" onClick={() => handleDisconnect(plugin.id)}>
                            <PowerOff className="w-4 h-4" />
                        </Button>
                    )}
                  </div>
               )}
            </CardContent>
            <CardFooter className='flex justify-between items-center'>
                <span className='text-xs text-muted-foreground'>v{plugin.version}</span>
                {!plugin.connected && (
                     <Button onClick={() => handleSave(plugin.id)}><Power className="w-4 h-4 mr-2" />Connect</Button>
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
