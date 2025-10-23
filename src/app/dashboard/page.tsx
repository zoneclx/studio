
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code, Archive, Users, Plug, Search, User as UserIcon } from 'lucide-react';

const quickLinks = [
  { title: 'AI Web Builder', description: 'Create a new project with AI.', href: '/create', icon: <Code className="w-8 h-8" /> },
  { title: 'Your Projects', description: 'View and manage your saved work.', href: '/my-archive', icon: <Archive className="w-8 h-8" /> },
  { title: 'Community Chat', description: 'Connect with other developers.', href: '/chat', icon: <Users className="w-8 h-8" /> },
  { title: 'Explore Plugins', description: 'Extend your editor\'s capabilities.', href: '/plugins', icon: <Plug className="w-8 h-8" /> },
];

// Mock user search results
const mockUsers = [
    { id: '1', name: 'Jane Doe', email: 'jane@example.com', avatar: 'https://i.ibb.co/9v3Cq3G/ezgif-com-webp-to-jpg-1.jpg' },
    { id: '2', name: 'John Smith', email: 'john@example.com', avatar: 'https://i.ibb.co/ryj1PzC/ezgif-com-webp-to-jpg.jpg' },
    { id: '3', name: 'Alex Ray', email: 'alex@example.com', avatar: 'https://i.ibb.co/3k5mR5c/ezgif-com-webp-to-jpg-2.jpg' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(mockUsers);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults(mockUsers); // Show all mock users if search is empty
    } else {
        // This is a simulation, in a real app you'd query your backend
        const results = mockUsers.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }
  };

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
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
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

      <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold font-display mb-4">Find Users</h2>
         <Card>
            <CardHeader>
                <CardTitle>Search for other developers</CardTitle>
                <CardDescription>This is a simulation. In a real app, this would search a database of public profiles.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
                    <Input 
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                        <Search className="w-5 h-5" />
                    </Button>
                </form>
                <div className="space-y-4">
                    {searchResults.map(foundUser => (
                        <div key={foundUser.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                           <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={foundUser.avatar} />
                                    <AvatarFallback><UserIcon /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{foundUser.name}</p>
                                    <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                                </div>
                           </div>
                           <Button variant="outline" size="sm">View Profile</Button>
                        </div>
                    ))}
                    {searchResults.length === 0 && (
                        <p className="text-center text-muted-foreground">No users found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}

    