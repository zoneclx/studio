
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { GitBranch, Box, Server, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePlugins } from '@/context/plugin-context';

const pluginsList = [
  {
    id: 'vercel-deployment',
    name: 'Vercel Deployment',
    description: 'Deploy your static sites directly to Vercel with a single click.',
    icon: <Server className="w-8 h-8 text-primary" />,
  },
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    description: 'Connect your GitHub account to sync repositories and manage versions.',
    icon: <GitBranch className="w-8 h-8 text-primary" />,
  },
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    description: 'Automatically format your HTML, CSS, and JS code using Prettier.',
    icon: <Code className="w-8 h-8 text-primary" />,
  },
];

export default function PluginsPage() {
  const { user, loading: authLoading } = useAuth();
  const { connectedPlugins, connectPlugin, disconnectPlugin, apiKeys } = usePlugins();
  const router = useRouter();
  const { toast } = useToast();
  const [localApiKeys, setLocalApiKeys] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/plugins');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setLocalApiKeys(apiKeys);
  }, [apiKeys]);

  const handleApiKeyChange = (pluginId: string, value: string) => {
    setLocalApiKeys(prev => ({ ...prev, [pluginId]: value }));
  };

  const handleConnect = (pluginId: string) => {
    const apiKey = localApiKeys[pluginId];
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter an API key to connect the plugin.',
        variant: 'destructive',
      });
      return;
    }
    connectPlugin(pluginId, apiKey);
    toast({
      title: 'Plugin Connected!',
      description: `The ${pluginsList.find(p => p.id === pluginId)?.name} plugin is now active.`,
    });
  };

  const handleDisconnect = (pluginId: string) => {
    disconnectPlugin(pluginId);
    setLocalApiKeys(prev => ({ ...prev, [pluginId]: '' }));
    toast({
      title: 'Plugin Disconnected',
      description: `The ${pluginsList.find(p => p.id === pluginId)?.name} plugin has been disconnected.`,
      variant: 'destructive'
    });
  };


  if (authLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4 flex-1 pt-24">
        <header className="mb-8">
            <Skeleton className="h-10 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/2" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-display flex items-center gap-3">
          <Box className="w-10 h-10" />
          Plugins & Integrations
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Extend the functionality of Mono Studio by connecting services. (This is a simulation)
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pluginsList.map((plugin) => {
          const isConnected = connectedPlugins.includes(plugin.id);
          return (
            <Card key={plugin.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-start gap-4">
                  {plugin.icon}
                  <div>
                    <CardTitle>{plugin.name}</CardTitle>
                    <CardDescription className="mt-1">{plugin.description}</CardDescription>
                  </div>
                </div>
                {isConnected && <Badge variant="secondary">Connected</Badge>}
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <Label htmlFor={`api-key-${plugin.id}`} className="text-xs text-muted-foreground">
                    API Key
                  </Label>
                  <Input
                    id={`api-key-${plugin.id}`}
                    type="password"
                    placeholder="Enter your API key"
                    value={localApiKeys[plugin.id] || ''}
                    onChange={(e) => handleApiKeyChange(plugin.id, e.target.value)}
                    disabled={isConnected}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {isConnected ? (
                  <Button variant="destructive" className="w-full" onClick={() => handleDisconnect(plugin.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleConnect(plugin.id)}>
                    Save & Connect
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
