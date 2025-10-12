'use client';

import {
  createContext,
  useContext,
  ReactNode,
  FC,
  ComponentType,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

interface FirebaseProviderProps {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: ReactNode;
}

export const FirebaseProvider: FC<FirebaseProviderProps> = ({
  app,
  auth,
  firestore,
  children,
}) => {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = (): FirebaseApp => useFirebase().app;
export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;

export function withFirebase<P extends object>(
  Component: ComponentType<P>
): FC<P> {
  const WithFirebaseComponent: FC<P> = (props) => (
    <FirebaseContext.Consumer>
      {(firebase) => {
        if (!firebase) {
          throw new Error(
            'Firebase context is not available. Make sure you have wrapped your component with FirebaseProvider.'
          );
        }
        return <Component {...props} firebase={firebase} />;
      }}
    </FirebaseContext.Consumer>
  );

  WithFirebaseComponent.displayName = `WithFirebase(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithFirebaseComponent;
}
