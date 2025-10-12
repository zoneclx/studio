'use client';

import React, { useMemo } from 'react';
import { FirebaseProvider, initializeFirebase } from '.';

export const FirebaseClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return <FirebaseProvider {...firebaseApp}>{children}</FirebaseProvider>;
};
