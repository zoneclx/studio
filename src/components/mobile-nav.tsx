
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Play, Save, Share2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface MobileNavProps {
  actions: {
    runPreview: () => void;
    saveWork: () => void;
    handleShare: () => void;
  };
}

export function MobileNav({ actions }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Editor Actions</SheetTitle>
        </SheetHeader>
        <Separator className='my-4' />
        <div className="flex flex-col space-y-3">
            <Button variant="ghost" className="justify-start gap-2" onClick={() => handleAction(actions.runPreview)}>
                <Play className="w-5 h-5" /> Run
            </Button>
            <Button variant="ghost" className="justify-start gap-2" onClick={() => handleAction(actions.saveWork)}>
                <Save className="w-5 h-5" /> Save
            </Button>
             <Button variant="ghost" className="justify-start gap-2" onClick={() => handleAction(actions.handleShare)}>
                <Share2 className="w-5 h-5" /> Share
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
