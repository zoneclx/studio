
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TypewriterEffectProps = {
  texts: string[];
  speed?: number;
  delay?: number;
  className?: string;
  cursorClassName?: string;
};

export default function TypewriterEffect({
  texts,
  speed = 50,
  delay = 2000,
  className,
  cursorClassName,
}: TypewriterEffectProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[textIndex];
      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        if (displayedText.length < currentText.length) {
          setDisplayedText((prev) => currentText.slice(0, prev.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, textIndex, texts, speed, delay]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={cn('flex items-center', className)}>
      <h2 className="relative">
        {displayedText}
        {showCursor && (
          <span className={cn('ml-2 text-primary', cursorClassName)}>|</span>
        )}
      </h2>
    </div>
  );
}
