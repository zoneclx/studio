
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, Archive, Users, Plug } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const quickLinks = [
  { title: 'AI Web Builder', description: 'Create a new project with AI.', href: '/under-development', icon: <Code className="w-8 h-8" />, status: 'under-development' },
  { title: 'Your Projects', description: 'View and manage your saved work.', href: '/my-archive', icon: <Archive className="w-8 h-8" /> },
  { title: 'Community Chat', description: 'Connect with other developers.', href: '/chat', icon: <Users className="w-8 h-8" /> },
  { title: 'Explore Plugins', description: 'Extend your editor\'s capabilities.', href: '/plugins', icon: <Plug className="w-8 h-8" /> },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="container mx-auto max-w-5xl py-8 px-4 flex-1 pt-24">
        <header className="mb-8">
          <Skeleton className="h-10 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 flex-1 pt-24">
      <header className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold font-display">Welcome, {user.displayName || 'Developer'}!</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          This is your command center. Start a new project or manage your existing work.
        </p>
      </header>

      <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-bold font-display mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link href={link.href} key={index}>
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all transform hover:-translate-y-1 relative">
                {link.status === 'under-development' && (
                  <Badge variant="secondary" className="absolute top-2 right-2">Under Development</Badge>
                )}
                <CardHeader>
                  <div className="text-primary">{link.icon}</div>
                  <CardTitle className="mt-2">{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
