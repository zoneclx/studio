
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Sparkles, CheckCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: enter email, 2: email sent, 3: reset password, 4: success
  const { toast } = useToast();
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would trigger an email.
      // For simulation, we check if user exists and move to next step.
      const users = JSON.parse(localStorage.getItem('monochrome-auth-users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      if (!userExists) {
        throw new Error("No account found with this email.");
      }
      setStep(2);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: "Passwords don't match.", variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email, newPassword);
      toast({
        title: 'Success!',
        description: 'Your password has been reset.',
      });
      setStep(4);
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm border-border/50 bg-card">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-display flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  MonoMuse
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
        )}
        {step === 2 && (
            <>
                <CardHeader className="items-center text-center">
                    <Mail className="w-16 h-16 text-primary mb-4" />
                    <CardTitle>Check Your Email</CardTitle>
                    <CardDescription>A password reset link has been sent to {email}. (This is a simulation).</CardDescription>
                </CardHeader>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={() => setStep(3)}>Reset Password (from simulated email)</Button>
                    <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>Back</Button>
                </CardFooter>
            </>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter your new password for {email}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </CardFooter>
          </form>
        )}
        {step === 4 && (
            <>
                <CardHeader className="items-center text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <CardTitle>Password Reset!</CardTitle>
                    <CardDescription>Your password has been successfully updated.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => router.push('/login')}>Return to Login</Button>
                </CardFooter>
            </>
        )}
      </Card>
    </div>
  );
}
