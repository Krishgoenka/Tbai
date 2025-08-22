// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "technobillion-ai-platform",
  appId: "1:543559355076:web:b3f7e5a07c3dcb6bfad791",
  storageBucket: "technobillion-ai-platform.appspot.com",
  apiKey: "AIzaSyBrT_oYIYok1KwSmzAeZir73hCVafilbTg",
  authDomain: "technobillion-ai-platform.firebaseapp.com",
  messagingSenderId: "543559355076",
};

// Initialize Firebase for SSR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
