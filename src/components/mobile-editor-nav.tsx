
'use client';

import { Button } from '@/components/ui/button';
import { Code, Eye, Terminal, File } from 'lucide-react';
import { cn } from '@/lib/utils';

type MobileView = 'files' | 'editor' | 'preview' | 'terminal';

interface MobileEditorNavProps {
  activeView: MobileView;
  setView: (view: MobileView) => void;
}

export function MobileEditorNav({ activeView, setView }: MobileEditorNavProps) {
  const navItems = [
    { view: 'files' as const, icon: <File className="w-5 h-5" />, label: 'Files' },
    { view: 'editor' as const, icon: <Code className="w-5 h-5" />, label: 'Code' },
    { view: 'preview' as const, icon: <Eye className="w-5 h-5" />, label: 'Preview' },
    { view: 'terminal' as const, icon: <Terminal className="w-5 h-5" />, label: 'Terminal' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-lg border-t flex lg:hidden z-20">
      {navItems.map((item) => (
        <Button
          key={item.view}
          variant="ghost"
          onClick={() => setView(item.view)}
          className={cn(
            'flex-1 flex flex-col items-center justify-center h-full rounded-none text-xs gap-1',
            activeView === item.view
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  );
}
