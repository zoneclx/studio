
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { Card } from './ui/card';

const COOKIE_CONSENT_KEY = 'byteai-cookie-consent';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent !== 'true') {
        setShowConsent(true);
      }
    } catch (e) {
        // localStorage is not available, but we should still show the banner
        // to be transparent. The accept button just won't be able to save the state.
        setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    try {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setShowConsent(false);
    } catch (e) {
        // If localStorage is not available, just hide the banner for the current session.
        setShowConsent(false);
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300">
        <Card className="max-w-xl mx-auto p-4 bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Cookie className="h-6 w-6 sm:h-5 sm:w-5 mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm text-card-foreground">
                        We use cookies to enhance your experience, analyze site traffic, and for security and marketing purposes. By continuing to use our site, you agree to our use of cookies.
                    </p>
                </div>
                <Button onClick={acceptConsent} className="w-full sm:w-auto shrink-0">
                    Accept
                </Button>
            </div>
        </Card>
    </div>
  );
}
