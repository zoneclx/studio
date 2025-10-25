
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Sparkles, ArrowLeft, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, signIn } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password, rememberMe);
      toast({
        title: 'Success!',
        description: 'You have successfully signed in.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Authentication Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-sm text-center">
                    <CardHeader>
                        <CardTitle>You're Already In!</CardTitle>
                        <CardDescription>You are already logged in as {user.email}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard">
                            <Button className="w-full">
                                <LogIn className="mr-2 h-4 w-4" /> Go to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

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
        <form onSubmit={handleSignIn}>
          <CardHeader>
            <CardTitle className="text-2xl font-display flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Welcome Back
              </Link>
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
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
            <div className="grid gap-2">
                 <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                    >
                    Forgot your password?
                    </Link>
                </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
                disabled={loading}
              />
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Remember me
                </label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </CardContent>
          <CardFooter className="flex-col items-center">
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline text-primary">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
