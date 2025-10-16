
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Search, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

const featuredPlugins = [
  { name: 'AI Code Assistant', description: 'Get AI-powered code suggestions and completions.', version: '1.2.0' },
  { name: 'Live Database Connector', description: 'Connect to a live database for dynamic content.', version: '0.8.5' },
  { name: 'Theme Pack', description: 'A collection of additional themes for your editor.', version: '2.0.1' },
  { name: 'Deployment Helper', description: 'Easily deploy your project to various platforms.', version: '1.5.0' },
];

export default function PluginsPage() {
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
        <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Upload Plugin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPlugins.map((plugin) => (
          <Card key={plugin.name}>
            <CardHeader>
              <CardTitle>{plugin.name}</CardTitle>
              <CardDescription>{plugin.description}</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-between items-center'>
                <span className='text-xs text-muted-foreground'>v{plugin.version}</span>
                <Button>Install</Button>
            </CardContent>
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
