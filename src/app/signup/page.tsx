
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
      router.push('/create');
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

  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.25 1.95-3.52 0-6.33-2.88-6.33-6.42s2.81-6.42 6.33-6.42c1.93 0 3.3.74 4.18 1.59l2.48-2.38C18.09.91 15.68 0 12.48 0 5.88 0 .81 5.16.81 11.83s5.07 11.83 11.67 11.83c3.41 0 6.13-1.16 8.14-3.21 2.11-2.11 2.8-5.32 2.8-7.98 0-.7-.07-1.3-.2-1.95h-10.7z"
      ></path>
    </svg>
  );

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
            <Button variant="outline" className="w-full" type="button" disabled={loading}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
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
