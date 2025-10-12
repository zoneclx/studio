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
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % 1; // Only one text
      const fullText = text;

      setDisplayedText(
        isDeleting
          ? fullText.substring(0, displayedText.length - 1)
          : fullText.substring(0, displayedText.length + 1)
      );

      setTypingSpeed(isDeleting ? speed / 2 : speed);

      if (!isDeleting && displayedText === fullText) {
        setShowCursor(true); // Keep cursor at the end
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayedText, isDeleting, loopNum, speed, text, typingSpeed]);

  useEffect(() => {
    // Blinking cursor effect when typing is finished
    if (displayedText === text) {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    } else {
        setShowCursor(true); // Keep cursor visible while typing
    }
  }, [displayedText, text])

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
