/**
 * Firebase Configuration
 * 
 * Replace the firebaseConfig values below with your actual Firebase project credentials.
 * You can find these in your Firebase Console > Project Settings > General > Your apps
 * 
 * Steps to set up:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or select existing)
 * 3. Add a Web app
 * 4. Copy the config object and paste below
 * 5. Enable Authentication > Email/Password sign-in method
 * 6. Create a Firestore Database
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBxDKDT9XUkIJSujQ7FLn8Bp4N7ZNSp5Og",
  authDomain: "graduation-project-ideas.firebaseapp.com",
  projectId: "graduation-project-ideas",
  storageBucket: "graduation-project-ideas.firebasestorage.app",
  messagingSenderId: "865631776754",
  appId: "1:865631776754:web:85c257865d048ebb18c56b",
  measurementId: "G-T66F41XPY7"
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  // appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
