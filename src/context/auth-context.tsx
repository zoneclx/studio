
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string;
  name?: string;
  avatar?: string;
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
  forgotPassword: (email: string, newPass: string) => Promise<void>;
  updateProfile: (details: { name?: string; avatar?: string }) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'monochrome-auth-users';
const SESSION_STORAGE_KEY = 'monochrome-session-user';

const getStoredUsers = (): StoredUser[] => {
  try {
    if (typeof window !== 'undefined') {
        let usersStr = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!usersStr) {
          // If no users, seed the specific user
          const initialUser: StoredUser = {
            uid: 'local-user-' + new Date().getTime(),
            email: 'enzogimena.shawn@gmail.com',
            pass: 'ourLady$4',
            name: 'Enzo Shawn',
            avatar: ''
          };
          const initialUsers = [initialUser];
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(initialUsers));
          usersStr = JSON.stringify(initialUsers);
        }
        return JSON.parse(usersStr) as StoredUser[];
    }
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
  }
  return [];
};

const setStoredUsers = (users: StoredUser[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
    }
  } catch (error) {
     console.error("Failed to set users in localStorage", error);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      try {
        if (typeof window !== 'undefined') {
            const sessionUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
            if (sessionUser) {
              const parsedUser: User = JSON.parse(sessionUser);
              // Sync with localStorage to get latest profile updates
              const storedUsers = getStoredUsers();
              const storedUserData = storedUsers.find(u => u.uid === parsedUser.uid);
              if(storedUserData) {
                setActiveUser(storedUserData);
              } else {
                // User not in storage, sign them out.
                signOut();
              }
            }
        }
      } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const setActiveUser = (activeUser: User | null) => {
    setUser(activeUser);
    try {
        if (typeof window !== 'undefined') {
            if (activeUser) {
              // Create a version of the user object without the password to store in session
              const { pass, ...sessionUser } = activeUser as StoredUser;
              sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
            } else {
              sessionStorage.removeItem(SESSION_STORAGE_KEY);
            }
        }
    } catch (error) {
        console.error("Failed to set user in sessionStorage", error);
    }
  }

  const signIn = async (email: string, pass: string) => {
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(u => u.email === email);

    if (foundUser && foundUser.pass === pass) {
      setActiveUser(foundUser);
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
    
    const newUser: StoredUser = { 
      uid: 'local-user-' + new Date().getTime(), 
      email: email, 
      pass: pass,
      name: email.split('@')[0],
      avatar: ''
    };
    const updatedUsers = [...storedUsers, newUser];
    setStoredUsers(updatedUsers);
    
    setActiveUser(newUser);
  };

  const forgotPassword = async (email: string, newPass: string) => {
    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.email === email);

    if (userIndex === -1) {
      throw new Error('No account found with that email address.');
    }

    storedUsers[userIndex].pass = newPass;
    setStoredUsers(storedUsers);
  };
  
  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user) throw new Error('You must be logged in.');

    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.uid === user.uid);

    if (userIndex === -1) throw new Error('User not found.');
    
    const storedUser = storedUsers[userIndex];

    if (storedUser.pass !== currentPass) {
      throw new Error('Incorrect current password.');
    }

    storedUsers[userIndex].pass = newPass;
    setStoredUsers(storedUsers);
  };


  const updateProfile = async (details: { name?: string; avatar?: string }) => {
    if (!user) throw new Error('You must be logged in to update your profile.');

    const storedUsers = getStoredUsers();
    const userIndex = storedUsers.findIndex(u => u.uid === user.uid);

    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const updatedUser = { ...storedUsers[userIndex], ...details };
    storedUsers[userIndex] = updatedUser;
    setStoredUsers(storedUsers);
    setActiveUser(updatedUser);
  };

  const signOut = async () => {
    setActiveUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, forgotPassword, updateProfile, changePassword }}>
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
