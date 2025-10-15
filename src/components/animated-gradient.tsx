
'use client';

import { cn } from '@/lib/utils';

export default function AnimatedGradient() {
    return (
        <div
            className={cn(
                "fixed inset-0 -z-10 w-full h-full",
                "animated-gradient-background"
            )}
        />
    );
}
