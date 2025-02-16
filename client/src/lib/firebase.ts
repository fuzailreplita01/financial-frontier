import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, getRedirectResult, UserCredential, setPersistence, browserSessionPersistence } from "firebase/auth";

import { connectAuthEmulator } from "firebase/auth";
// Log the environment variables (without exposing sensitive data)
console.log("Firebase config check:", {
  hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  hasAppId: !!import.meta.env.VITE_FIREBASE_APP_ID,
});

if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  console.error("Missing VITE_FIREBASE_PROJECT_ID environment variable");
}

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error("Missing VITE_FIREBASE_API_KEY environment variable");
}

if (!import.meta.env.VITE_FIREBASE_APP_ID) {
  console.error("Missing VITE_FIREBASE_APP_ID environment variable");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID, // This is optional
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID,
  authDomain: "localhost:9099",
};

console.log("Initializing Firebase with domain:", `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`);
console.log("VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Use browser's language
if (import.meta.env.MODE === "development") {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
}

// Set session persistence BEFORE sign-in
setPersistence(auth, browserSessionPersistence)
.then(() => {
  console.log("✅ Firebase auth persistence set");
})
.catch((error) => {
  console.error("❌ Error setting auth persistence:", error);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({ prompt: "select_account", redirect_uri: "http://localhost:5000",
});

export { getRedirectResult };