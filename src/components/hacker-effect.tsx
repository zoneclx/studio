
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
  iterations = 8,
  delay = 2000,
  className,
}: HackerEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(texts[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback((targetText: string) => {
    let iteration = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const newText = targetText
        .split('')
        .map((_, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('');
      
      setDisplayedText(newText);

      if (iteration >= targetText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / (iterations / 2);
    }, 30);
  }, [iterations]);

  useEffect(() => {
    scramble(texts[textIndex]);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [textIndex, texts, scramble]);

  useEffect(() => {
    const timeout = setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [displayedText, texts.length, delay]);

  return (
    <h2 className={cn('font-mono', className)}>
      {displayedText}
    </h2>
  );
}
