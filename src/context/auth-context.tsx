'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string;
}

interface StoredUser extends User {
  pass: string;
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
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser: StoredUser = JSON.parse(storedUser);
          setUser({ uid: parsedUser.uid, email: parsedUser.email });
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
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: StoredUser = JSON.parse(storedUser);
        if (parsedUser.email === email && parsedUser.pass === pass) {
          setUser({ uid: parsedUser.uid, email: parsedUser.email });
          return;
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage during sign-in", error);
    }
    throw new Error('Invalid email or password');
  };

  const signUp = async (email: string, pass: string) => {
    if (email && pass) {
        const mockUser: StoredUser = { uid: 'local-user-' + new Date().getTime(), email: email, pass: pass };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser({ uid: mockUser.uid, email: mockUser.email });
        return;
    }
    throw new Error('Please provide a valid email and password');
  };

  const signOut = async () => {
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
