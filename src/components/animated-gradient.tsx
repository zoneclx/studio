
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

    // This component will now always render the gradient background.
    // The theme variables in globals.css will handle the color changes.
    if (!isMounted) {
        return <div className="fixed inset-0 -z-10 w-full h-full bg-background" />;
    }

    return (
        <div
            className={cn(
                "fixed inset-0 -z-10 w-full h-full",
                "opacity-100", // Control opacity directly here if needed
                "transition-opacity duration-1000",
                "animated-gradient-background" // This class is now always present
            )}
        />
    );
}
