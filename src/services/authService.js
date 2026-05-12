/**
 * Authentication Service
 * Handles all Firebase Authentication operations
 * Encrypts user profile fields in Firestore
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { encryptFields, decryptFields } from '../utils/encryption';

// Fields to encrypt in user profile documents
const ENCRYPTED_USER_FIELDS = ['displayName', 'email'];

/**
 * Register a new user with email and password
 * Also creates a user profile document in Firestore (with encrypted fields)
 */
export const registerUser = async (email, password, displayName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the display name in Firebase Auth
    await updateProfile(user, { displayName });

    // Create user profile document in Firestore with encryption
    const profileData = {
      uid: user.uid,
      email,
      displayName,
      photoURL: null,
      teamId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const encryptedProfile = encryptFields(profileData, ENCRYPTED_USER_FIELDS);
    await setDoc(doc(db, 'users', user.uid), encryptedProfile);

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Logout the current user
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Get user profile from Firestore (decrypts encrypted fields)
 */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const profile = decryptFields(docSnap.data(), ENCRYPTED_USER_FIELDS);
      return { profile, error: null };
    }
    return { profile: null, error: 'User profile not found' };
  } catch (error) {
    return { profile: null, error: error.message };
  }
};
