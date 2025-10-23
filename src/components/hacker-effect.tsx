
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
  const [displayedText, setDisplayedText] = useState('');
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback((targetText: string) => {
    let currentText = '';
    let letterIndex = 0;

    const animate = () => {
      if (letterIndex >= targetText.length) {
        setDisplayedText(targetText);
        // Schedule next text after a delay
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setTextIndex(prev => (prev + 1) % texts.length);
        }, delay);
        return;
      }

      let scrambleIteration = 0;
      const scrambleLetter = () => {
        if (scrambleIteration >= iterations) {
          currentText += targetText[letterIndex];
          letterIndex++;
          setDisplayedText(currentText);
          // Move to the next letter
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          setDisplayedText(currentText + randomChar);
          scrambleIteration++;
          setTimeout(scrambleLetter, 40); // speed of scrambling a single letter
        }
      };
      scrambleLetter();
    };
    
    animate();

  }, [iterations, delay, texts.length]);

  useEffect(() => {
    setDisplayedText(''); // Reset displayed text when target text changes
    scramble(texts[textIndex]);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [textIndex, texts, scramble]);

  return (
    <h2 className={cn('font-mono', className)}>
      {displayedText}
    </h2>
  );
}
