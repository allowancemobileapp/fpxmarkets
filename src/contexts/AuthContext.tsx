
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { type User as FirebaseUser, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuthClient } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  isLoading: boolean; // This will be !initialAuthCheckDone
  initialAuthCheckDone: boolean; // Explicitly expose this if needed by layouts
  handleFirebaseEmailPasswordSignup: (email: string, pass: string) => Promise<FirebaseUser>;
  handleFirebaseEmailPasswordLogin: (email: string, pass: string) => Promise<FirebaseUser>;
  handleGoogleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateAppUser: (updatedProfileData: AppUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicPages = ['/', '/login', '/signup', '/forgot-password', '/privacy-policy', '/terms-of-service'];
const marketingPages = ['/about', '/markets', '/pricing', '/contact', '/copy-trading', '/partners', '/quick-start', '/resources', '/trading', '/trading-platforms', '/more'];
const specialOnboardingPages = ['/signup-details', '/setup-pin'];
const allPublicAndOnboardingPages = [...publicPages, ...marketingPages, ...specialOnboardingPages];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLoading = !initialAuthCheckDone; // isLoading is true until initial Firebase auth check completes

  const ensureRedirect = useCallback((targetPath: string) => {
    // Check window.location.pathname to prevent redirecting if already on the page,
    // especially useful if router.push is async or state updates cause re-renders.
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      console.log(`[AuthContext] CLIENT: ensureRedirect: Current window.location.pathname (${window.location.pathname}) !== targetPath (${targetPath}). Calling router.push.`);
      router.push(targetPath);
    } else if (typeof window !== 'undefined' && window.location.pathname === targetPath) {
      console.log(`[AuthContext] CLIENT: ensureRedirect: Already on target path ${targetPath}, no redirect needed.`);
    } else {
      // Fallback or initial server render, rely on pathname from Next.js router
      if (pathname !== targetPath) {
        console.log(`[AuthContext] CLIENT: ensureRedirect (SSR/initial): Current Next.js pathname (${pathname}) !== targetPath (${targetPath}). Calling router.push.`);
        router.push(targetPath);
      } else {
         console.log(`[AuthContext] CLIENT: ensureRedirect (SSR/initial): Already on target path ${targetPath}, no redirect needed.`);
      }
    }
  }, [pathname, router]);

  const fetchUserProfile = useCallback(async (uid: string): Promise<AppUser | null> => {
    console.log(`[AuthContext] CLIENT: fetchUserProfile called for UID: ${uid}`);
    try {
      const response = await fetch(`/api/user/profile?firebaseAuthUid=${uid}`);
      if (response.ok) {
        const profileData = await response.json();
        console.log('[AuthContext] CLIENT: Profile fetched successfully:', profileData);
        return profileData as AppUser;
      }
      if (response.status === 404) {
        console.warn(`[AuthContext] CLIENT: Profile not found (404) for UID: ${uid}. This might be a new user or an API issue. Check server logs for API route load status for /api/user/profile.`);
        return null;
      }
      // Log other errors more verbosely
      const errorText = await response.text().catch(() => "Could not read error response text");
      console.error(`[AuthContext] CLIENT: Error fetching profile. Status: ${response.status}. Response: ${errorText.substring(0, 500)}`);
      return null;
    } catch (error) {
      console.error('[AuthContext] CLIENT: Network or other error fetching profile:', error);
      return null;
    }
  }, []);


  // Effect for Firebase Auth State Listener
  useEffect(() => {
    console.log('[AuthContext] CLIENT: Setting up Firebase onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(firebaseAuthClient, (user) => {
      console.log('[AuthContext] CLIENT: onAuthStateChanged triggered. Firebase user UID:', user ? user.uid : 'null');
      setFirebaseUser(user);
      if (!initialAuthCheckDone) {
        setInitialAuthCheckDone(true); // Mark initial check as done AFTER first callback
      }
    });
    return () => {
      console.log('[AuthContext] CLIENT: Cleaning up Firebase onAuthStateChanged listener.');
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount


  // Effect for Profile Fetching and Redirection Logic
  useEffect(() => {
    if (!initialAuthCheckDone) {
      console.log('[AuthContext] CLIENT: (Profile/Redirect Effect) Initial auth check not complete. Skipping.');
      return; 
    }

    console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) Running. fbUser: ${firebaseUser?.uid}, appUser: ${appUser?.email}, path: ${pathname}`);

    if (firebaseUser) {
      // If appUser is not loaded yet for the current firebaseUser, or if it's for a different firebaseUser
      if (!appUser || appUser.firebase_auth_uid !== firebaseUser.uid) {
        console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) fbUser (${firebaseUser.uid}) exists, but appUser is missing or mismatched. Fetching profile.`);
        fetchUserProfile(firebaseUser.uid).then(profile => {
          console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) Profile fetch completed. Profile:`, profile ? profile.email : 'null');
          setAppUser(profile); 
          // The effect will run again with the new appUser state.
          // If profile is null here (new user), the next run will handle redirection to /signup-details.
        });
        return; // Exit this run, wait for appUser to be set.
      }

      // appUser is loaded and matches firebaseUser, proceed with redirection logic
      console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) appUser (${appUser.email}) is loaded and matches fbUser.`);
      if (!appUser.profile_completed_at) {
        console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) Profile not complete for ${appUser.email}. Ensuring redirect to /signup-details.`);
        ensureRedirect('/signup-details');
      } else if (!appUser.pin_setup_completed_at) {
        console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) PIN not set up for ${appUser.email}. Ensuring redirect to /setup-pin.`);
        ensureRedirect('/setup-pin');
      } else {
        console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) User ${appUser.email} fully set up. Current path: ${pathname}. Ensuring redirect to dashboard.`);
        const redirectUrl = searchParams.get('redirectUrl') || '/dashboard';
        if (!pathname.startsWith('/dashboard')) { 
          ensureRedirect(redirectUrl);
        } else {
          console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) Already on/targeting a dashboard page (${pathname}), no redirect needed.`);
        }
      }
    } else { // No Firebase user
      console.log('[AuthContext] CLIENT: (Profile/Redirect Effect) No Firebase user.');
      if (appUser) { // If there was an appUser, clear it
        console.log('[AuthContext] CLIENT: (Profile/Redirect Effect) Clearing stale appUser.');
        setAppUser(null);
      }
      if (!allPublicAndOnboardingPages.includes(pathname) && !pathname.startsWith('/_next/')) {
        console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) No Firebase user, not on public/onboarding page (${pathname}). Ensuring redirect to /login.`);
        ensureRedirect('/login');
      } else {
         console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) No Firebase user, already on public/onboarding page (${pathname}) or no redirect needed.`);
      }
    }
  }, [initialAuthCheckDone, firebaseUser, appUser, pathname, searchParams, fetchUserProfile, ensureRedirect]);


  const updateAppUser = useCallback((updatedProfileData: AppUser | null) => {
    console.log('[AuthContext] CLIENT: updateAppUser explicitly called with:', updatedProfileData ? updatedProfileData.email : 'null');
    setAppUser(updatedProfileData); // This will trigger the Profile/Redirect useEffect.
  }, []);

  const handleFirebaseEmailPasswordSignup = async (email: string, pass: string) => {
    // setIsLoading(true); // Not needed, initialAuthCheckDone handles loading
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthClient, email, pass);
      console.log('[AuthContext] CLIENT: Firebase email signup successful for:', userCredential.user.email);
      // onAuthStateChanged and subsequent Profile/Redirect useEffect will handle setting firebaseUser, fetching profile (which will be null), and redirecting to /signup-details
      return userCredential.user;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email signup error:', error.code, error.message);
      // setIsLoading(false);
      throw error;
    }
  };

  const handleFirebaseEmailPasswordLogin = async (email: string, pass: string) => {
    // setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthClient, email, pass);
      console.log('[AuthContext] CLIENT: Firebase email login successful for:', userCredential.user.email);
      // onAuthStateChanged and subsequent Profile/Redirect useEffect will handle this
      return userCredential.user;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email login error:', error.code, error.message, error);
      // setIsLoading(false);
      throw error;
    }
  };
  
  const handleGoogleSignIn = async () => {
    // setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuthClient, provider);
      console.log('[AuthContext] CLIENT: Google sign-in successful for:', result.user.email);
      // onAuthStateChanged and subsequent Profile/Redirect useEffect will handle this
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Google sign-in error:', error.code, error.message);
      // setIsLoading(false);
      throw error; // Re-throw to be caught by the calling component if needed
    }
  };

  const logout = async () => {
    console.log('[AuthContext] CLIENT: Logging out...');
    // setInitialAuthCheckDone(false); // Re-enable loading state on logout
    try {
      await signOut(firebaseAuthClient);
      // setFirebaseUser(null); // onAuthStateChanged will set this
      // setAppUser(null);    // Profile/Redirect useEffect will clear this
      console.log('[AuthContext] CLIENT: Firebase signOut successful. Redirection will be handled by Profile/Redirect useEffect.');
      // ensureRedirect('/login'); // Let the effect handle this after fbUser becomes null
    } catch (error) {
      console.error('[AuthContext] CLIENT: Error during Firebase signOut:', error);
    } 
    // finally {
    //   // setIsLoading(false); // Handled by initialAuthCheckDone logic
    // }
  };
  
  // This loader is a global fallback if not on a public/onboarding page AND initial auth check is pending.
  if (isLoading && !allPublicAndOnboardingPages.includes(pathname) && !pathname.startsWith('/_next/')) {
    console.log(`[AuthContext] CLIENT: Displaying global loading screen. isLoading: ${isLoading} (initialAuthCheckDone: ${initialAuthCheckDone}), pathname: ${pathname}`);
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Initializing session...</p>
      </div>
    );
  }
  // console.log(`[AuthContext] CLIENT: Rendering children. isLoading: ${isLoading} (initialAuthCheckDone: ${initialAuthCheckDone}), pathname: ${pathname}`);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, isLoading, initialAuthCheckDone, handleFirebaseEmailPasswordSignup, handleFirebaseEmailPasswordLogin, handleGoogleSignIn, logout, updateAppUser }}>
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
