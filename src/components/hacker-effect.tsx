
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

type HackerEffectProps = {
  texts: string[];
  iterations?: number;
  delay?: number;
  className?: string;
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default function HackerEffect({
  texts,
  delay = 2000,
  className,
}: HackerEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [revealedText, setRevealedText] = useState('');
  const [scrambledChar, setScrambledChar] = useState('');
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const targetText = texts[textIndex];
    let currentIndex = 0;
    let scrambleCount = 0;

    const animate = () => {
      if (currentIndex < targetText.length) {
        if (scrambleCount < 3) { // Scramble 3 times
          setScrambledChar(characters[Math.floor(Math.random() * characters.length)]);
          scrambleCount++;
          timeoutRef.current = setTimeout(animate, 50);
        } else {
          setRevealedText(prev => prev + targetText[currentIndex]);
          setScrambledChar('');
          currentIndex++;
          scrambleCount = 0;
          timeoutRef.current = setTimeout(animate, 30);
        }
      } else {
        // Finished typing the text, wait for delay then switch to next text
        timeoutRef.current = setTimeout(() => {
          setRevealedText('');
          setTextIndex(prev => (prev + 1) % texts.length);
        }, delay);
      }
    };

    animate();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [textIndex, texts, delay]);


  return (
    <h2 className={cn('font-mono', className)}>
      <span className="text-foreground">{revealedText}</span>
      <span className="text-primary">{scrambledChar}</span>
    </h2>
  );
}
