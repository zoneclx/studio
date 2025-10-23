
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, signOut as firebaseSignOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { useAuth as useFirebaseAuth, useUser } from '@/firebase/provider';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (details: { name?: string; avatar?: string }) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isUserLoading, userError } = useUser();
  const auth = useFirebaseAuth();
  const router = useRouter();

  const signIn = async (email: string, pass: string, rememberMe = false) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    initiateEmailSignIn(auth, email, pass);
    router.push('/dashboard');
  };

  const signUp = async (email: string, pass: string) => {
    initiateEmailSignUp(auth, email, pass);
    router.push('/dashboard');
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  // These are now placeholders and will be re-implemented with Firebase.
  const updateProfile = async (details: { name?: string; avatar?: string }) => {
    console.log('updateProfile not implemented with Firebase yet', details);
    // This will be replaced with Firestore logic
  };

  const changePassword = async (currentPass: string, newPass: string) => {
     console.log('changePassword not implemented with Firebase yet');
    // This will be replaced with Firebase Auth logic
  };
  
  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading: isUserLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
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
