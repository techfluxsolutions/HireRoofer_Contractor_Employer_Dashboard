// src/firebase.js
// Single, correct firebase initialization using environment variables.

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Build the config from env vars (these are injected at build/start time)
const firebaseConfig = {
  apiKey: "AIzaSyBWvuEGjxx7dPHoh0I3oYGixkuN9pP19t0",
  authDomain: "hire-roofer.firebaseapp.com",
  projectId: "hire-roofer",
  storageBucket: "hire-roofer.firebasestorage.app",
  messagingSenderId: "802656126866",
  appId: "1:802656126866:web:1954d8f6e41168ab71e34b",
  measurementId: "G-KW00NKYF61"
};

// Debug: verify env values in dev (remove this console.log in production)
if (process.env.NODE_ENV === "development") {
  // Useful to confirm the env is actually loaded — check browser console
  // Warning: do not expose secret keys in production logs
  console.log("Firebase config (dev):",firebaseConfig);
}

// Initialize app only once
const app = initializeApp(firebaseConfig);

// Initialize analytics only if measurementId present and window is available
let analytics;
try {
  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // analytics may fail in some environments; ignore gracefully
  // console.warn("Firebase analytics not initialized:", e);
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
