
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

type TypewriterEffectProps = {
  texts: string[];
  speed?: number;
  delay?: number;
  className?: string;
  cursorClassName?: string;
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};


export default function TypewriterEffect({
  texts,
  speed = 50,
  delay = 2000,
  className,
  cursorClassName,
}: TypewriterEffectProps) {
  const { theme } = useTheme();
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Hacker effect state
  const [hackerText, setHackerText] = useState<React.ReactNode>('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
      // Cleanup previous animations if theme changes
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (theme === 'redhat') {
          setHackerText(texts[textIndex]);
      } else {
          // Reset for typewriter effect
          setDisplayedText('');
          setIsDeleting(false);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, textIndex]);


  // Typewriter effect logic
  useEffect(() => {
    if (theme === 'redhat') return;

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
  }, [displayedText, isDeleting, textIndex, texts, speed, delay, theme]);

   // Hacker effect logic
  useEffect(() => {
    if (theme !== 'redhat') return;

    let iterations = 0;
    const targetText = texts[textIndex];

    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
        const newText = targetText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return <span key={index} className="text-foreground">{targetText[index]}</span>;
                }
                if (char === ' ') return <span key={index}> </span>;
                return <span key={index} className="text-primary">{characters[Math.floor(Math.random() * characters.length)]}</span>;
            });
        
        setHackerText(<>{newText}</>);

        if (iterations >= targetText.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeout(() => {
                setTextIndex((prev) => (prev + 1) % texts.length);
            }, delay);
        }

        iterations += 1 / 2;
    }, 30);


    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    }

  }, [theme, textIndex, texts, delay]);


  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const isRedHat = theme === 'redhat';

  return (
    <div className={cn('flex items-center', className)}>
      <h2
        className={cn('relative font-code')}
      >
        {isRedHat ? hackerText : displayedText}
        {showCursor && !isRedHat && (
          <span className={cn('ml-2 text-primary', cursorClassName)}>|</span>
        )}
      </h2>
    </div>
  );
}
