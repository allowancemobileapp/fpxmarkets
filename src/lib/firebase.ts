// src/lib/firebase.ts
// TODO: Replace with your actual Firebase configuration
// import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
// import { getAuth, type Auth } from 'firebase/auth';
// import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// let app: FirebaseApp;
// let auth: Auth;
// let db: Firestore;

// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps()[0];
// }

// auth = getAuth(app);
// db = getFirestore(app);

// export { app, auth, db };

// Simulated Firebase for now
export const app = null;
export const auth = null;
export const db = null;

console.warn(
  'Firebase is currently simulated. Replace src/lib/firebase.ts with your actual Firebase configuration and uncomment the Firebase SDK imports and initialization code.'
);
