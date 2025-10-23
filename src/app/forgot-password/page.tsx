
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Sparkles, CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { forgotPassword } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || "Failed to send password reset email.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-sm mb-4">
            <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </div>
      <Card className="w-full max-w-sm border-border/50 bg-card">
        {!emailSent ? (
          <form onSubmit={handleEmailSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-display flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Forgot Password
                </Link>
              </CardTitle>
              <CardDescription>
                Enter your email to receive a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
               <div className="mt-4 text-center text-sm">
                Remember your password?{' '}
                <Link href="/login" className="underline text-primary">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
            <>
                <CardHeader className="items-center text-center">
                    <Mail className="w-16 h-16 text-primary mb-4" />
                    <CardTitle>Check Your Email</CardTitle>
                    <CardDescription>A password reset link has been sent to {email}. Please check your inbox and spam folder.</CardDescription>
                </CardHeader>
                <CardFooter className="flex-col gap-4">
                    <Link href="/login" className="w-full">
                      <Button className="w-full">Return to Login</Button>
                    </Link>
                </CardFooter>
            </>
        )}
      </Card>
    </div>
  );
}
