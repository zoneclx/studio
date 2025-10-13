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
import { Sparkles, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: enter email, 2: reset password, 3: success
  const { toast } = useToast();
  const { forgotPassword } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would just check if the user exists
      // For simulation, we can proceed if the format is okay
      if (!email.includes('@')) throw new Error("Invalid email format");
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
      setStep(3);
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
                  Monochrome Ai
                </Link>
              </CardTitle>
              <CardDescription>
                Enter your email to reset your password.
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
                {loading ? 'Submitting...' : 'Continue'}
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
        {step === 3 && (
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
