
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
  iterations = 3, // controls scramble iterations per letter
  delay = 2000,
  className,
}: HackerEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [resolvedText, setResolvedText] = useState('');
  const [scramblingChar, setScramblingChar] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const letterIndexRef = useRef(0);
  const scrambleIterationRef = useRef(0);

  const scramble = useCallback((targetText: string) => {
    letterIndexRef.current = 0;
    scrambleIterationRef.current = 0;
    setResolvedText('');
    setScramblingChar('');

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (letterIndexRef.current >= targetText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setScramblingChar('');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setTextIndex(prev => (prev + 1) % texts.length);
        }, delay);
        return;
      }

      if (scrambleIterationRef.current < iterations) {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        setScramblingChar(randomChar);
        scrambleIterationRef.current++;
      } else {
        setResolvedText(prev => prev + targetText[letterIndexRef.current]);
        setScramblingChar('');
        letterIndexRef.current++;
        scrambleIterationRef.current = 0;
      }
    }, 40);

  }, [iterations, delay, texts.length]);

  useEffect(() => {
    scramble(texts[textIndex]);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [textIndex, texts, scramble]);

  return (
    <h2 className={cn('font-mono', className)}>
      {resolvedText}
      <span className="text-primary">{scramblingChar}</span>
    </h2>
  );
}
