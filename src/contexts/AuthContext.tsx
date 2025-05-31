
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { type User as FirebaseUser, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuthClient } from '@/lib/firebase'; // Renamed to avoid conflict
import type { AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  isLoading: boolean;
  handleFirebaseEmailPasswordSignup: typeof createUserWithEmailAndPassword;
  handleFirebaseEmailPasswordLogin: typeof signInWithEmailAndPassword;
  handleGoogleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateAppUser: (updatedProfileData: AppUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicPages = ['/login', '/signup', '/forgot-password', '/privacy-policy', '/terms-of-service', '/'];
// Add other public marketing pages like /about, /markets, /pricing, /contact etc.
const marketingPages = ['/about', '/markets', '/pricing', '/contact', '/copy-trading', '/partners', '/quick-start', '/resources', '/trading', '/trading-platforms'];
const allPublicPages = [...publicPages, ...marketingPages];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {
    if (router) { // Check if router is available
        setRouterReady(true);
    }
  }, [router]);


  const fetchUserProfile = useCallback(async (uid: string): Promise<AppUser | null> => {
    console.log(`[AuthContext] CLIENT: Fetching profile for UID: ${uid}`);
    try {
      const response = await fetch(`/api/user/profile?firebaseAuthUid=${uid}`);
      if (response.ok) {
        const profileData = await response.json();
        console.log('[AuthContext] CLIENT: Profile fetched successfully:', profileData);
        return profileData as AppUser;
      }
      if (response.status === 404) {
        console.log('[AuthContext] CLIENT: Profile not found (404) for UID:', uid, '- This is expected for a new user or if API route is down.');
        return null;
      }
      console.error(`[AuthContext] CLIENT: Error fetching profile. Status: ${response.status}. Response:`, await response.text().catch(() => 'Could not read error response body'));
      return null;
    } catch (error) {
      console.error('[AuthContext] CLIENT: Network or other error fetching profile:', error);
      return null;
    }
  }, []);

  const updateAppUser = (updatedProfileData: AppUser | null) => {
    console.log('[AuthContext] CLIENT: updateAppUser called with:', updatedProfileData);
    setAppUser(updatedProfileData);
    // The main useEffect will react to this appUser change and handle redirection.
  };


  useEffect(() => {
    if (!routerReady) {
      console.log('[AuthContext] CLIENT: Router not ready, skipping auth state listener setup.');
      return;
    }
    console.log('[AuthContext] CLIENT: Setting up Firebase onAuthStateChanged listener.');
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(firebaseAuthClient, async (fbUser) => {
      console.log('[AuthContext] CLIENT: onAuthStateChanged triggered. Firebase user:', fbUser ? fbUser.uid : 'null');
      setFirebaseUser(fbUser);

      if (fbUser) {
        const profile = await fetchUserProfile(fbUser.uid);
        setAppUser(profile);

        if (profile) {
          if (!profile.profile_completed_at) {
            console.log('[AuthContext] CLIENT: Profile not complete, redirecting to /signup-details.');
            if (pathname !== '/signup-details') router.push('/signup-details');
          } else if (!profile.pin_setup_completed_at) {
            console.log('[AuthContext] CLIENT: PIN not set up, redirecting to /setup-pin.');
            if (pathname !== '/setup-pin') router.push('/setup-pin');
          } else {
            console.log('[AuthContext] CLIENT: User fully set up. Current path:', pathname);
             if (!pathname.startsWith('/dashboard')) {
                 console.log('[AuthContext] CLIENT: Redirecting to /dashboard.');
                 router.push('/dashboard');
             }
          }
        } else {
          // Profile not found in DB (e.g. new Firebase user, or API error)
          console.log('[AuthContext] CLIENT: App profile not found after Firebase auth, redirecting to /signup-details.');
           if (pathname !== '/signup-details') router.push('/signup-details');
        }
      } else {
        // No Firebase user
        setAppUser(null);
        if (!allPublicPages.includes(pathname) && !pathname.startsWith('/dashboard/_')) { // Allow internal Next.js routes
          console.log('[AuthContext] CLIENT: No Firebase user, not on public page. Current path:', pathname, 'Redirecting to /login.');
          if (pathname !== '/login') router.push('/login');
        } else {
            console.log('[AuthContext] CLIENT: No Firebase user, already on a public page or no redirect needed. Path:', pathname);
        }
      }
      setIsLoading(false);
      console.log('[AuthContext] CLIENT: Finished processing auth state change. isLoading:', false);
    });

    return () => {
      console.log('[AuthContext] CLIENT: Cleaning up Firebase onAuthStateChanged listener.');
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerReady, fetchUserProfile]); // Removed router and pathname to reduce re-runs; redirect logic inside handles current path.

  const handleFirebaseEmailPasswordSignup = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthClient, email, pass);
      // onAuthStateChanged will handle the new user
      console.log('[AuthContext] CLIENT: Firebase email signup successful for:', userCredential.user.email);
      return userCredential;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email signup error:', error.code, error.message);
      setIsLoading(false);
      throw error; // Re-throw for the form to handle
    }
  };

  const handleFirebaseEmailPasswordLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthClient, email, pass);
      // onAuthStateChanged will handle the logged-in user
      console.log('[AuthContext] CLIENT: Firebase email login successful for:', userCredential.user.email);
      return userCredential;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email login error:', error.code, error.message);
      setIsLoading(false);
      throw error; // Re-throw for the form to handle
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuthClient, provider);
      // onAuthStateChanged will handle the new/logged-in user
      console.log('[AuthContext] CLIENT: Google sign-in successful for:', result.user.email);
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Google sign-in error:', error.code, error.message);
      setIsLoading(false);
      // Potentially show a toast message for Google sign-in errors
    }
  };

  const logout = async () => {
    console.log('[AuthContext] CLIENT: Logging out...');
    setIsLoading(true);
    try {
      await signOut(firebaseAuthClient);
      // onAuthStateChanged will set firebaseUser and appUser to null and redirect.
      console.log('[AuthContext] CLIENT: Firebase signOut successful.');
    } catch (error) {
      console.error('[AuthContext] CLIENT: Error during Firebase signOut:', error);
      // Still attempt to clear local state
      setFirebaseUser(null);
      setAppUser(null);
      setIsLoading(false);
      if (pathname !== '/login') router.push('/login');
    }
  };
  
  if (isLoading && !firebaseUser && !allPublicPages.includes(pathname)) {
    // Show a global loading spinner if still loading and not on a public page.
    // This aims to prevent premature rendering of protected content or login page.
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Initializing authentication...</p>
      </div>
    );
  }


  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, isLoading, handleFirebaseEmailPasswordSignup, handleFirebaseEmailPasswordLogin, handleGoogleSignIn, logout, updateAppUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('[AuthContext] CLIENT: useAuth must be used within an AuthProvider');
  }
  return context;
}
