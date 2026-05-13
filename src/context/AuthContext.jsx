/**
 * Authentication Context
 * Provides global authentication state throughout the application
 * Decrypts encrypted user profile fields (including teamId) from Firestore
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { encryptFields, decryptFields, decryptDeterministic } from '../utils/encryption';

// Non-deterministic encrypted fields
const ENCRYPTED_USER_FIELDS = ['displayName', 'email'];

const AuthContext = createContext(null);

/**
 * Custom hook to access auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Process raw Firestore profile data: decrypt fields
   */
  const processProfile = (rawData) => {
    const profile = decryptFields(rawData, ENCRYPTED_USER_FIELDS);
    // Decrypt teamId (deterministic encryption)
    if (profile.teamId && typeof profile.teamId === 'string') {
      profile.teamId = decryptDeterministic(profile.teamId);
    }
    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(processProfile(docSnap.data()));
          } else {
            // Auto-create profile if user exists in Auth but not Firestore
            const newProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'User',
              photoURL: null,
              teamId: null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            const encryptedProfile = encryptFields(newProfile, ENCRYPTED_USER_FIELDS);
            await setDoc(docRef, encryptedProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Refresh user profile data from Firestore
   */
  const refreshProfile = async () => {
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(processProfile(docSnap.data()));
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
