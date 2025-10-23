
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8 animate-fade-in-up text-center">
        <Shield className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-4xl font-bold font-display mt-4">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-6 md:p-8">
          <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
                <p>
                  Welcome to Byte Studio. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">2. Collection of Your Information</h2>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect via the Application includes:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application.
                  </li>
                  <li>
                    <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">3. Use of Your Information</h2>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Create and manage your account.</li>
                  <li>Email you regarding your account or order.</li>
                  <li>Enable user-to-user communications.</li>
                  <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
                </ul>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">4. Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">5. Contact Us</h2>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at: enzogimena.business@gmail.com
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
