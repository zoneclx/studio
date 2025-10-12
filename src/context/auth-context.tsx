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

const AUTH_STORAGE_KEY = 'monochrome-auth-users';
const SESSION_STORAGE_KEY = 'monochrome-session-user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem(AUTH_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return [];
  }
};

const setStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      try {
        const sessionUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionUser) {
          const parsedUser: User = JSON.parse(sessionUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);
  
  const setActiveUser = (activeUser: User | null) => {
    setUser(activeUser);
    if (activeUser) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeUser));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  const signIn = async (email: string, pass: string) => {
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(u => u.email === email);

    if (foundUser && foundUser.pass === pass) {
      setActiveUser({ uid: foundUser.uid, email: foundUser.email });
      return;
    }
    
    throw new Error('Invalid email or password');
  };

  const signUp = async (email: string, pass: string) => {
    if (!email || !pass) {
        throw new Error('Please provide a valid email and password');
    }
    const storedUsers = getStoredUsers();
    const existingUser = storedUsers.find(u => u.email === email);

    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }
    
    const newUser: StoredUser = { uid: 'local-user-' + new Date().getTime(), email: email, pass: pass };
    const updatedUsers = [...storedUsers, newUser];
    setStoredUsers(updatedUsers);
    
    setActiveUser({ uid: newUser.uid, email: newUser.email });
  };

  const signOut = async () => {
    setActiveUser(null);
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
