
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

type HackerEffectProps = {
  texts: string[];
  delay?: number;
  className?: string;
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};\':",.<>/?`~';

export default function HackerEffect({
  texts,
  delay = 2000,
  className,
}: HackerEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [revealedText, setRevealedText] = useState('');
  const [scrambledChar, setScrambledChar] = useState('');
  
  const textRef = useRef(texts);
  const animationFrameRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const animate = useCallback(() => {
    const targetText = textRef.current[textIndex];
    let currentLength = revealedText.length;

    if (currentLength < targetText.length) {
      let scrambleCount = 0;
      const maxScrambles = 2; // Reduced from 3
      
      const updateScramble = () => {
        if (scrambleCount < maxScrambles) {
          setScrambledChar(characters[Math.floor(Math.random() * characters.length)]);
          scrambleCount++;
          timeoutRef.current = setTimeout(updateScramble, 25); // Reduced from 50
        } else {
          setScrambledChar('');
          setRevealedText(targetText.substring(0, currentLength + 1));
        }
      };
      updateScramble();
    } else {
      // Finished revealing, wait for delay then switch to next text
      timeoutRef.current = setTimeout(() => {
        setTextIndex(prev => (prev + 1) % textRef.current.length);
        setRevealedText('');
      }, delay);
    }
  }, [textIndex, revealedText, delay]);

  useEffect(() => {
    // Start animation when revealedText or textIndex changes
    animate();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [revealedText, textIndex, animate]);

  return (
    <h2 className={cn('font-mono', className)}>
      <span className="text-foreground">{revealedText}</span>
      {scrambledChar && <span className="text-primary">{scrambledChar}</span>}
    </h2>
  );
}
