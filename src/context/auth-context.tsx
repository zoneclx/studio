'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const signIn = async (email: string, pass: string) => {
    // Simulate a sign-in process
    if (email && pass) {
        const mockUser = { uid: 'local-user-123', email: email };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
    }
    throw new Error('Invalid email or password');
  };

  const signUp = async (email: string, pass: string) => {
    // Simulate a sign-up process
    if (email && pass) {
        const mockUser = { uid: 'local-user-' + new Date().getTime(), email: email };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
    }
    throw new Error('Please provide a valid email and password');
  };

  const signOut = async () => {
    // Simulate sign-out
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
