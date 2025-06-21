// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnQgfyKHP0cenN_BlQ8cl5-Fffg3tXaqU",
  authDomain: "resume-app-b1d2a.firebaseapp.com",
  projectId: "resume-app-b1d2a",
  storageBucket: "resume-app-b1d2a.firebasestorage.app",
  messagingSenderId: "928865035381",
  appId: "1:928865035381:web:ed8b9f78588d040492043c",
  measurementId: "G-4NKFHFDZB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, analytics, auth, provider, db };
