// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Vercel, you would use environment variables like this:
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required environment variables are set
const requiredVars = Object.entries(firebaseConfig).filter(([key, value]) => !value);

if (requiredVars.length > 0) {
    console.error("Firebase config is missing required environment variables:");
    requiredVars.forEach(([key]) => {
        console.error(` - NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase().replace('FIREBASE_', '')}`);
    });
    // We can't initialize Firebase, so we'll throw an error or handle it gracefully
    // For now, we will log and the app will likely fail when it tries to use Firebase services.
}


// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
