
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
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: 'Account Created!',
        description: 'You have successfully signed up.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message,
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
        <form onSubmit={handleSignUp}>
          <CardHeader>
            <CardTitle className="text-2xl font-display flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Create an Account
              </Link>
            </CardTitle>
            <CardDescription>
              Enter your details below to create your account.
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <div className="relative my-2">
                <Separator />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-card">
                    <span className="text-xs text-muted-foreground">OR</span>
                </div>
            </div>
            <Link href="/mono-login" className='w-full'>
                <Button variant="outline" className="w-full" type="button">
                    Sign in with Byte Ai
                </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex-col items-center">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline text-primary">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
