import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, getRedirectResult, UserCredential } from "firebase/auth";

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
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID, // This is optional
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID
};

console.log("Initializing Firebase with domain:", `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Use browser's language

export const googleProvider = new GoogleAuthProvider();

export { getRedirectResult };

// Configure additional scopes for Google OAuth
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set custom parameters
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// getRedirectResult(auth)
//   .then((result) => {
//     if (result) {
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential?.accessToken;
//       const user = result.user;
//       console.log(user, token)
//     }
//   }).catch((error) => {
//     // // Handle Errors here.
//     // const errorCode = error.code;
//     // const errorMessage = error.message;
//     // // The email of the user's account used.
//     // const email = error.customData.email;
//     // // The AuthCredential type that was used.
//     // const credential = GoogleAuthProvider.credentialFromError(error);
//     console.log(error)
//   });