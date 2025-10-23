
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const email = 'enzogimena.business@gmail.com';

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4 flex-1 flex items-center justify-center pt-24">
      <Card className="w-full animate-fade-in-up">
        <CardHeader className="text-center">
          <Mail className="w-12 h-12 mx-auto text-primary" />
          <CardTitle className="text-4xl font-bold font-display mt-4">Contact Us</CardTitle>
          <CardDescription className="text-lg mt-2">
            We'd love to hear from you.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            For any questions, feedback, or inquiries, please reach out to us via email.
          </p>
          <a href={`mailto:${email}`} className="text-lg font-semibold text-primary hover:underline break-all">
            {email}
          </a>
          <div className="mt-6">
            <a href={`mailto:${email}`}>
              <Button>
                Send an Email
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
