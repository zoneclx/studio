
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);

  const scramble = useCallback((targetText: string) => {
    setIsAnimating(true);
    let iteration = 0;

    const interval = setInterval(() => {
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
        clearInterval(interval);
        setIsAnimating(false);
      }

      iteration += 1 / (iterations / 2);
    }, 30);

    return () => clearInterval(interval);
  }, [iterations]);

  useEffect(() => {
    if (isAnimating) return;

    const timeout = setTimeout(() => {
      const nextIndex = (textIndex + 1) % texts.length;
      setTextIndex(nextIndex);
      scramble(texts[nextIndex]);
    }, delay);

    return () => clearTimeout(timeout);
  }, [textIndex, texts, delay, isAnimating, scramble]);

  return (
    <h2 className={cn('font-mono', className)}>
      {displayedText}
    </h2>
  );
}
