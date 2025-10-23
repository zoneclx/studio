
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type HackerEffectProps = {
  texts: string[];
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
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const targetText = texts[textIndex];
    let currentIndex = 0;

    const animateChar = () => {
      if (currentIndex >= targetText.length) {
        // Animation for the current text is complete
        setIsAnimating(false);
        // Wait for the delay, then switch to the next text
        timeoutRef.current = setTimeout(() => {
          setTextIndex(prev => (prev + 1) % texts.length);
          setDisplayedText('');
          setIsAnimating(true);
        }, delay);
        return;
      }
      
      // Start scrambling the current character
      let scrambleCount = 0;
      const maxScrambles = 3;
      
      const scrambleInterval = setInterval(() => {
        if (scrambleCount >= maxScrambles) {
          clearInterval(scrambleInterval);
          // Reveal the correct character
          setDisplayedText(prev => prev + targetText[currentIndex]);
          currentIndex++;
          // Move to the next character
          animateChar();
        } else {
          // Show a random character
          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          setDisplayedText(prev => prev.slice(0, currentIndex) + randomChar);
          scrambleCount++;
        }
      }, 50);
    };

    if (isAnimating) {
      animateChar();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [textIndex, texts, delay, isAnimating]);


  return (
    <h2 className={cn('font-mono break-words', className)}>
      <span className="text-foreground">{displayedText.slice(0,-1)}</span>
      <span className="text-primary">{displayedText.slice(-1)}</span>
    </h2>
  );
}

    