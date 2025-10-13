
'use client';

import { useTheme } from '@/context/theme-context';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function AnimatedGradient() {
    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div
            className={cn(
                "fixed inset-0 -z-10 w-full h-full",
                "opacity-30 dark:opacity-50",
                "transition-opacity duration-1000",
                {
                    "animated-gradient-background": theme !== "light",
                    "opacity-0": theme === "light"
                }
            )}
        />
    );
}
