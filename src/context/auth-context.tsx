
'use client';

import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, signOut as firebaseSignOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, updateProfile as firebaseUpdateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
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
    // Prepare updates for Firebase Auth profile
    const authUpdatePayload: { displayName?: string; photoURL?: string } = {};
    if (profileData.displayName) {
        authUpdatePayload.displayName = profileData.displayName;
    }
    if (profileData.photoURL) {
        authUpdatePayload.photoURL = profileData.photoURL;
    }

    // Update Firebase Auth profile if there's anything to update
    if (Object.keys(authUpdatePayload).length > 0) {
        await firebaseUpdateProfile(userToUpdate, authUpdatePayload);
    }
    
    // Update Firestore document
    const userDocRef = doc(firestore, 'users', userToUpdate.uid);
    setDocumentNonBlocking(userDocRef, profileData, { merge: true });
  }, [firestore]);
  
  useEffect(() => {
    if (user && !isUserLoading) {
      let profileUpdateNeeded = false;
      let profileData: any = {
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

  const isUsernameTaken = async (username: string): Promise<boolean> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('displayName_lowercase', '==', username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const updateProfile = async (details: { name?: string; avatar?: string }) => {
    if (!user) throw new Error("Not authenticated");

    const updatePayload: { displayName?: string; displayName_lowercase?: string; photoURL?: string } = {};

    if (details.name && details.name !== user.displayName) {
      const isTaken = await isUsernameTaken(details.name);
      if (isTaken) {
        toast({
          title: 'Username Taken',
          description: 'This display name is already in use. Please choose another one.',
          variant: 'destructive',
        });
        return; // Stop the update process
      }
      updatePayload.displayName = details.name;
      updatePayload.displayName_lowercase = details.name.toLowerCase();
    }
    
    if (details.avatar) {
      updatePayload.photoURL = details.avatar;
    }

    if (Object.keys(updatePayload).length > 0) {
        await updateUserProfile(user, updatePayload);
    }
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
