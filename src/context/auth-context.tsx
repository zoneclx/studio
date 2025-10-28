
'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, signOut as firebaseSignOut, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, updateProfile as firebaseUpdateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword, sendEmailVerification, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth as useFirebaseAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, where, getDocs, limit, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (details: { name?: string }) => Promise<void>;
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
  const { toast } = useToast();

  const signIn = async (email: string, pass: string, rememberMe = false) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    if(newUser) {
        await sendEmailVerification(newUser);
         toast({
            title: 'Verification Email Sent',
            description: "We've sent a verification link to your email address. Please check your inbox!",
        });
        const userDocRef = doc(firestore, 'users', newUser.uid);
        const randomUsername = generateRandomUsername();
        await firebaseUpdateProfile(newUser, { displayName: randomUsername });
        // Use a blocking setDoc here to ensure the document exists before proceeding
        await setDoc(userDocRef, {
            uid: newUser.uid,
            email: newUser.email,
            displayName: randomUsername,
            displayName_lowercase: randomUsername.toLowerCase(),
        });
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const isUsernameTaken = async (username: string): Promise<boolean> => {
    if (!firestore) return false;
    const usersRef = collection(firestore, 'users');
    // Ensure we are not checking against the current user's own name if it hasn't changed.
    if(user && user.displayName?.toLowerCase() === username.toLowerCase()) return false;
    const q = query(usersRef, where('displayName_lowercase', '==', username.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const updateProfile = async (details: { name?: string }) => {
    if (!user) throw new Error("Not authenticated");

    const authUpdatePayload: { displayName?: string } = {};
    const firestoreUpdatePayload: { displayName?: string; displayName_lowercase?: string } = {};

    if (details.name && details.name !== user.displayName) {
      const isTaken = await isUsernameTaken(details.name);
      if (isTaken) {
        throw new Error('This display name is already in use. Please choose another one.');
      }
      authUpdatePayload.displayName = details.name;
      firestoreUpdatePayload.displayName = details.name;
      firestoreUpdatePayload.displayName_lowercase = details.name.toLowerCase();
    }
    
    if (Object.keys(authUpdatePayload).length > 0) {
      await firebaseUpdateProfile(user, authUpdatePayload);
    }
    
    if (firestore && Object.keys(firestoreUpdatePayload).length > 0) {
      const userDocRef = doc(firestore, 'users', user.uid);
      // Use blocking update to ensure changes are saved and permissions are checked.
      await setDoc(userDocRef, firestoreUpdatePayload, { merge: true });
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user || !user.email) throw new Error("Not authenticated");
    if (!user.emailVerified) throw new Error("Email not verified. Please verify your email before changing the password.");

    const credential = EmailAuthProvider.credential(user.email, currentPass);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        throw new Error('The current password you entered is incorrect. Please try again.');
      }
      // Re-throw other errors
      throw error;
    }
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
