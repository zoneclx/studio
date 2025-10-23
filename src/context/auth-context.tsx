
'use client';

import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, signOut as firebaseSignOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, updateProfile as firebaseUpdateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { useAuth as useFirebaseAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { doc } from 'firebase/firestore';

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

// Helper function to generate a random username
const generateRandomUsername = () => {
    const adjectives = ["Creative", "Cyber", "Quantum", "Nano", "Digital", "Glitch", "Byte", "Data", "Logic", "Pixel"];
    const nouns = ["Wizard", "Ninja", "Hacker", "Explorer", "Pioneer", "Jedi", "Phantom", "Surfer", "Golem", "Matrix"];
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${randomNumber}`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const updateUserProfile = useCallback(async (userToUpdate: User, profileData: any) => {
    // Update Firebase Auth profile
    await firebaseUpdateProfile(userToUpdate, {
      displayName: profileData.displayName,
      photoURL: profileData.photoURL,
    });
    // Update Firestore document
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    setDocumentNonBlocking(userDocRef, profileData, { merge: true });
  }, [firestore]);
  
  useEffect(() => {
    if (user && !isUserLoading) {
      let profileUpdateNeeded = false;
      let profileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        displayName_lowercase: user.displayName?.toLowerCase(),
        photoURL: user.photoURL,
      };

      if (!user.displayName) {
        profileData.displayName = generateRandomUsername();
        profileData.displayName_lowercase = profileData.displayName.toLowerCase();
        profileUpdateNeeded = true;
      }
      
      const userDocRef = doc(firestore, 'users', user.uid);
      if (profileUpdateNeeded) {
        // This is a non-blocking call to update both Auth and Firestore
        updateUserProfile(user, profileData);
      } else {
        // Just update firestore, non-blocking
        setDocumentNonBlocking(userDocRef, profileData, { merge: true });
      }
    }
  }, [user, isUserLoading, firestore, updateUserProfile]);

  const signIn = async (email: string, pass: string, rememberMe = false) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    initiateEmailSignIn(auth, email, pass);
    // Let the onAuthStateChanged handle the redirect via the user/loading state in pages.
  };

  const signUp = async (email: string, pass: string) => {
    initiateEmailSignUp(auth, email, pass);
    // Let the onAuthStateChanged handle the redirect.
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const updateProfile = async (details: { name?: string; avatar?: string }) => {
    if (!user) throw new Error("Not authenticated");
    await updateUserProfile(user, {
        displayName: details.name,
        photoURL: details.avatar,
        displayName_lowercase: details.name?.toLowerCase(),
    });
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user || !user.email) throw new Error("Not authenticated");
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPass);
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
