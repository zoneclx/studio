
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

type HackerEffectProps = {
  texts: string[];
  iterations?: number;
  delay?: number;
  className?: string;
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function HackerEffect({
  texts,
  iterations = 3,
  delay = 2000,
  className,
}: HackerEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState(texts[0]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const scramble = useCallback((targetText: string) => {
    let iteration = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }

    intervalRef.current = setInterval(() => {
        setDisplayText(
            targetText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return targetText[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );

      if (iteration >= targetText.length) {
        if(intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / iterations;
    }, 40);
  }, [iterations]);

  useEffect(() => {
    scramble(texts[textIndex]);
    
    const timeout = setTimeout(() => {
      setTextIndex(prev => (prev + 1) % texts.length);
    }, delay + texts[textIndex].length * 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
  }, [textIndex, texts, scramble, delay]);

  return (
    <h2 className={cn('font-mono', className)}>
      {displayText.split("").map((char, index) => {
          const isResolved = texts[textIndex][index] === char;
          return (
              <span key={index} className={isResolved ? 'text-foreground' : 'text-primary'}>
                  {char}
              </span>
          )
      })}
    </h2>
  );
}
