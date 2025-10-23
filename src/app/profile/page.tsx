
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit, KeyRound, ShieldCheck, ShieldAlert, MailWarning } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const MAX_AVATAR_SIZE = 512; // Max width/height in pixels

// Function to resize image on the client-side
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_AVATAR_SIZE) {
            height *= MAX_AVATAR_SIZE / width;
            width = MAX_AVATAR_SIZE;
          }
        } else {
          if (height > MAX_AVATAR_SIZE) {
            width *= MAX_AVATAR_SIZE / height;
            height = MAX_AVATAR_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg')); // Use JPEG for better compression
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};


export default function ProfilePage() {
  const { user, loading, updateProfile, changePassword, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isVerificationEmailSending, setIsVerificationEmailSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setName(user.displayName || '');
      setAvatar(user.photoURL || '');
    }
  }, [user, loading, router]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedImageDataUrl = await resizeImage(file);
        setAvatar(resizedImageDataUrl);
      } catch (error) {
        console.error("Image resizing failed:", error);
        toast({
          title: 'Image Processing Failed',
          description: 'Could not process the selected image. Please try another one.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({ name, avatar });
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Error',
        description: "New passwords don't match.",
        variant: 'destructive',
      });
      return;
    }
    setIsPasswordSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      toast({
        title: 'Password Change Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsVerificationEmailSending(true);
    try {
        await sendVerificationEmail();
        toast({
            title: "Verification Email Sent",
            description: "Please check your inbox (and spam folder) for the verification link."
        });
    } catch (error: any) {
        toast({
            title: "Failed to Send Email",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsVerificationEmailSending(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex flex-col flex-1 p-4 pt-24">
        <main className="container mx-auto max-w-2xl py-8 px-4 flex-1">
          <Skeleton className="h-10 w-1/2 mb-8" />
          <Card>
            <CardHeader className="items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-4 pt-24">
      <main className="container mx-auto max-w-2xl py-8 px-4 flex-1">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold font-display">Your Profile</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Customize your account details and manage your password.
          </p>
        </header>
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card>
              <CardHeader className="items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                         <Input
                            id="email"
                            value={user.email!}
                            disabled
                        />
                        {user.emailVerified ? (
                            <Badge variant="secondary" className='gap-1.5'>
                                <ShieldCheck className="h-4 w-4 text-green-500"/>
                                Verified
                            </Badge>
                        ) : (
                             <Badge variant="destructive" className='gap-1.5'>
                                <ShieldAlert className="h-4 w-4"/>
                                Unverified
                            </Badge>
                        )}
                    </div>
                     {!user.emailVerified && (
                        <Alert variant="destructive" className="mt-2">
                            <MailWarning className="h-4 w-4" />
                            <AlertTitle>Verify Your Email</AlertTitle>
                            <AlertDescription>
                                Your email is unverified. Please check your inbox or click below to resend the verification email.
                            </AlertDescription>
                             <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto mt-2"
                                onClick={handleSendVerificationEmail}
                                disabled={isVerificationEmailSending}
                                >
                                {isVerificationEmailSending ? "Sending..." : "Resend Verification Email"}
                            </Button>
                        </Alert>
                    )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {user.emailVerified ? (
            <form onSubmit={handlePasswordChange} className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5" />
                    Change Password
                    </CardTitle>
                    <CardDescription>
                    Update your password here. It's recommended to use a strong, unique password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>                  <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                    <Input
                        id="confirm-new-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPasswordSubmitting}>
                    {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                    </Button>
                </CardFooter>
                </Card>
            </form>
          ) : (
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5" />
                        Change Password
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <Alert variant="destructive">
                        <MailWarning className="h-4 w-4" />
                        <AlertTitle>Action Required</AlertTitle>
                        <AlertDescription>
                            You must verify your email address before you can change your password.
                            For security reasons, if you have lost access to your email, please{' '}
                            <Link href="/contact" className="underline font-semibold">contact support</Link>
                            {' '}to recover your account.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
