'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TypewriterEffectProps = {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
};

export default function TypewriterEffect({
  text,
  speed = 50,
  className,
  cursorClassName,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isTyping && displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, speed, text]);

  useEffect(() => {
    if (!isTyping) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isTyping]);

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
