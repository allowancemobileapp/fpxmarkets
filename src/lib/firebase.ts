
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics"; // Only if you use analytics

console.log('[FirebaseClient] Attempting to initialize Firebase...');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

if (!firebaseConfig.apiKey) {
  console.error('[FirebaseClient] CRITICAL: NEXT_PUBLIC_FIREBASE_API_KEY is missing. Firebase will not initialize.');
}
if (!firebaseConfig.projectId) {
  console.error('[FirebaseClient] CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing. Firebase will not initialize.');
}

let app: FirebaseApp;
let auth: Auth;
// let analytics; // Only if you use analytics

if (!getApps().length) {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      // analytics = getAnalytics(app); // Only if you use analytics
      console.log('[FirebaseClient] Firebase initialized successfully for project:', firebaseConfig.projectId);
    } catch (error) {
      console.error('[FirebaseClient] Error initializing Firebase app:', error);
      // Fallback to dummy objects to prevent app crashing if components try to use them
      // @ts-ignore
      app = {}; 
      // @ts-ignore
      auth = {};
    }
  } else {
    console.error('[FirebaseClient] Firebase not initialized due to missing API key or Project ID.');
    // Fallback to dummy objects
    // @ts-ignore
    app = {};
    // @ts-ignore
    auth = {};
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  console.log('[FirebaseClient] Existing Firebase app instance re-used for project:', firebaseConfig.projectId);
}

export { app, auth };
// export { app, auth, analytics }; // If you use analytics
