
'use client';

import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, signOut as firebaseSignOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, updateProfile as firebaseUpdateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword, sendEmailVerification } from 'firebase/auth';
import { useAuth as useFirebaseAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { doc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (details: { name?: string; avatar?: string }) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
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
  
  useEffect(() => {
    if (user && !isUserLoading) {
      const userDocRef = doc(firestore, 'users', user.uid);
      let profileData: any = {};
      let profileUpdateNeeded = false;

      if (!user.displayName) {
        profileData.displayName = generateRandomUsername();
        profileData.displayName_lowercase = profileData.displayName.toLowerCase();
        profileUpdateNeeded = true;
      }
      
      if (profileUpdateNeeded) {
        // This is a non-blocking call to update both Auth and Firestore
        firebaseUpdateProfile(user, { displayName: profileData.displayName });
        setDocumentNonBlocking(userDocRef, { 
            uid: user.uid,
            email: user.email,
            displayName: profileData.displayName,
            displayName_lowercase: profileData.displayName_lowercase,
            photoURL: user.photoURL 
        }, { merge: true });
      } else {
        // Just update firestore, non-blocking
        setDocumentNonBlocking(userDocRef, { 
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            displayName_lowercase: user.displayName?.toLowerCase(),
            photoURL: user.photoURL 
        }, { merge: true });
      }
    }
  }, [user, isUserLoading, firestore]);

  const signIn = async (email: string, pass: string, rememberMe = false) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    initiateEmailSignIn(auth, email, pass);
    // Let the onAuthStateChanged handle the redirect via the user/loading state in pages.
  };

  const signUp = async (email: string, pass: string) => {
    initiateEmailSignUp(auth, email, pass, (user) => {
        if(user) {
            sendEmailVerification(user);
        }
    });
    // Let the onAuthStateChanged handle the redirect.
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const isUsernameTaken = async (username: string): Promise<boolean> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('displayName_lowercase', '==', username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const updateProfile = async (details: { name?: string; avatar?: string }) => {
    if (!user) throw new Error("Not authenticated");

    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    const firestoreUpdatePayload: { displayName?: string; displayName_lowercase?: string; photoURL?: string } = {};

    if (details.name && details.name !== user.displayName) {
      const isTaken = await isUsernameTaken(details.name);
      if (isTaken) {
        toast({
          title: 'Username Taken',
          description: 'This display name is already in use. Please choose another one.',
          variant: 'destructive',
        });
        throw new Error('Username Taken');
      }
      authUpdatePayload.displayName = details.name;
      firestoreUpdatePayload.displayName = details.name;
      firestoreUpdatePayload.displayName_lowercase = details.name.toLowerCase();
    }
    
    if (details.avatar) {
      authUpdatePayload.photoURL = details.avatar;
      firestoreUpdatePayload.photoURL = details.avatar;
    }

    if (Object.keys(authUpdatePayload).length > 0) {
      await firebaseUpdateProfile(user, authUpdatePayload);
    }
    if (Object.keys(firestoreUpdatePayload).length > 0) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDocumentNonBlocking(userDocRef, firestoreUpdatePayload, { merge: true });
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user || !user.email) throw new Error("Not authenticated");
    if (!user.emailVerified) throw new Error("Email not verified. Please verify your email before changing the password.");

    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPass);
  };
  
  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerificationEmail = async () => {
    if (!user) throw new Error("Not authenticated");
    await sendEmailVerification(user);
  };

  const value = {
    user,
    loading: isUserLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    changePassword,
    forgotPassword,
    sendVerificationEmail,
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
