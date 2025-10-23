
'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code, Archive, Users, Plug, Search, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, or, and, startAt, endAt } from 'firebase/firestore';

const quickLinks = [
  { title: 'AI Web Builder', description: 'Create a new project with AI.', href: '/under-development', icon: <Code className="w-8 h-8" />, status: 'under-development' },
  { title: 'Your Projects', description: 'View and manage your saved work.', href: '/my-archive', icon: <Archive className="w-8 h-8" /> },
  { title: 'Community Chat', description: 'Connect with other developers.', href: '/chat', icon: <Users className="w-8 h-8" /> },
  { title: 'Explore Plugins', description: 'Extend your editor\'s capabilities.', href: '/plugins', icon: <Plug className="w-8 h-8" /> },
];

interface AppUser {
    id: string;
    displayName: string;
    email: string;
    photoURL: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const usersRef = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);

  // Query for user search. This is dynamic based on searchTerm.
  const searchQuery = useMemoFirebase(() => {
    if (!searchTerm.trim()) {
        return null;
    }
    // We create a query that searches for a match at the beginning of the displayName or email.
    // Firestore is limited in its text search capabilities without a third-party service.
    // This is a basic prefix search.
    const endTerm = searchTerm.toLowerCase() + '\uf8ff';
    return query(
        usersRef,
        or(
            and(where('displayName_lowercase', '>=', searchTerm.toLowerCase()), where('displayName_lowercase', '<=', endTerm)),
            and(where('email', '>=', searchTerm.toLowerCase()), where('email', '<=', endTerm))
        )
    );
  }, [searchTerm, usersRef]);

  const { data: searchResults, isLoading: searchLoading } = useCollection<AppUser>(searchQuery);
  const { data: allUsers, isLoading: allUsersLoading } = useCollection<AppUser>(usersRef);
  
  const displayUsers = searchTerm.trim() ? searchResults : allUsers;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true); // Triggers the useCollection hook by updating the query
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

      <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-2xl font-bold font-display mb-4">Find Users</h2>
         <Card>
            <CardHeader>
                <CardTitle>Search for other developers</CardTitle>
                <CardDescription>Search for other users on the platform by their name or email.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-6">
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
                    {(searchLoading || allUsersLoading) ? (
                        <>
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </>
                    ) : displayUsers && displayUsers.length > 0 ? (
                        displayUsers.filter(u => u.id !== user.uid).map(foundUser => (
                            <div key={foundUser.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                               <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={foundUser.photoURL} />
                                        <AvatarFallback>{foundUser.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{foundUser.displayName}</p>
                                        <p className="text-sm text-muted-foreground">{foundUser.email}</p>
                                    </div>
                               </div>
                               <Button variant="outline" size="sm">View Profile</Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground">No users found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
