
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
  isLoading: boolean; // True until initial Firebase auth check is done AND initial appUser load attempt is complete
  initialAuthCheckDone: boolean;
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
  const [isLoadingAppUser, setIsLoadingAppUser] = useState(false); // Tracks if appUser profile is being fetched
  const [profileLastFetchedForUid, setProfileLastFetchedForUid] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLoading = !initialAuthCheckDone || isLoadingAppUser;

  const ensureRedirect = useCallback((targetPath: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      console.log(`[AuthContext] CLIENT: ensureRedirect: Current window.location.pathname (${window.location.pathname}) !== targetPath (${targetPath}). Calling router.push.`);
      router.push(targetPath);
    } else if (typeof window !== 'undefined' && window.location.pathname === targetPath) {
      console.log(`[AuthContext] CLIENT: ensureRedirect: Already on target path ${targetPath}, no redirect needed.`);
    } else {
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
        console.warn(`[AuthContext] CLIENT: Profile not found (404) for UID: ${uid}. This is expected for a new user.`);
        return null;
      }
      const errorText = await response.text().catch(() => "Could not read error response text");
      console.error(`[AuthContext] CLIENT: Error fetching profile. Status: ${response.status}. Response: ${errorText.substring(0, 500)}`);
      return null;
    } catch (error) {
      console.error('[AuthContext] CLIENT: Network or other error fetching profile:', error);
      return null;
    }
  }, []);


  useEffect(() => {
    console.log('[AuthContext] CLIENT: Setting up Firebase onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(firebaseAuthClient, (user) => {
      console.log('[AuthContext] CLIENT: onAuthStateChanged triggered. Firebase user UID:', user ? user.uid : 'null');
      setFirebaseUser(user); // This will trigger the other useEffect
      if (!initialAuthCheckDone) {
        setInitialAuthCheckDone(true);
      }
    });
    return () => {
      console.log('[AuthContext] CLIENT: Cleaning up Firebase onAuthStateChanged listener.');
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!initialAuthCheckDone) {
      console.log('[AuthContext] CLIENT: (Profile/Redirect Effect) Initial Firebase auth check not complete. Skipping.');
      return;
    }

    console.log(`[AuthContext] CLIENT: (Profile/Redirect Effect) Running. fbUser: ${firebaseUser?.uid}, appUser: ${appUser?.email}, path: ${pathname}, profileLastFetchedForUid: ${profileLastFetchedForUid}, isLoadingAppUser: ${isLoadingAppUser}`);

    if (firebaseUser) {
      // Scenario 1: Firebase user exists, but we haven't fetched/set their app profile for this specific UID yet.
      if (firebaseUser.uid !== profileLastFetchedForUid && !isLoadingAppUser) {
        console.log(`[AuthContext] CLIENT: New fbUser UID (${firebaseUser.uid}) or profile not yet fetched for this UID. Fetching profile.`);
        setIsLoadingAppUser(true);
        fetchUserProfile(firebaseUser.uid).then(profile => {
          setAppUser(profile);
          setProfileLastFetchedForUid(firebaseUser.uid);
          setIsLoadingAppUser(false);
          console.log(`[AuthContext] CLIENT: Profile fetch for ${firebaseUser.uid} complete. appUser set to:`, profile ? profile.email : 'null');
          // Redirection logic will be handled in the next run of this effect now that appUser and profileLastFetchedForUid are updated.
        });
        return; // Exit this run; wait for state updates and effect re-run.
      }

      // Scenario 2: Firebase user exists, and profile fetch for this UID has been attempted (profileLastFetchedForUid === firebaseUser.uid).
      // isLoadingAppUser should be false here if the fetch is complete.
      if (isLoadingAppUser) {
          console.log('[AuthContext] CLIENT: AppUser profile is still being fetched. Waiting...');
          return; // Still waiting for the fetch initiated above to complete.
      }

      // Proceed with redirection logic only if profile fetch for current user is done and we are not still loading it.
      if (firebaseUser.uid === profileLastFetchedForUid) {
        if (appUser === null) { // Profile fetch completed and returned null (new user)
          console.log(`[AuthContext] CLIENT: fbUser (${firebaseUser.email}) exists but no AppUser profile found in DB (appUser is null). Redirecting to /signup-details.`);
          if (pathname !== '/signup-details') ensureRedirect('/signup-details');
        } else if (appUser && !appUser.profile_completed_at) {
          console.log(`[AuthContext] CLIENT: AppUser (${appUser.email}) profile not complete. Redirecting to /signup-details.`);
          if (pathname !== '/signup-details') ensureRedirect('/signup-details');
        } else if (appUser && !appUser.pin_setup_completed_at) {
          console.log(`[AuthContext] CLIENT: AppUser (${appUser.email}) PIN not set up. Redirecting to /setup-pin.`);
          if (pathname !== '/setup-pin') ensureRedirect('/setup-pin');
        } else if (appUser) { // Fully set up
          console.log(`[AuthContext] CLIENT: AppUser (${appUser.email}) fully set up. Current path: ${pathname}.`);
          const redirectUrlFromQuery = searchParams.get('redirectUrl');
          if (redirectUrlFromQuery) {
            console.log(`[AuthContext] CLIENT: redirectUrl query param found: ${redirectUrlFromQuery}. Redirecting.`);
            router.replace(redirectUrlFromQuery);
          } else if (!pathname.startsWith('/dashboard')) {
            console.log('[AuthContext] CLIENT: Not on dashboard, redirecting to /dashboard.');
            ensureRedirect('/dashboard');
          } else {
            console.log(`[AuthContext] CLIENT: Already on/targeting a dashboard page (${pathname}), no redirect needed from appUser completion checks.`);
          }
        }
      } else if (!isLoadingAppUser) {
        // This case should ideally not be hit if logic above is correct, means fbUser changed and fetch hasn't started.
         console.log(`[AuthContext] CLIENT: fbUser.uid (${firebaseUser.uid}) !== profileLastFetchedForUid (${profileLastFetchedForUid}) and not loading. This might indicate a state sync issue. Forcing profile re-fetch trigger.`);
         setProfileLastFetchedForUid(null); // Force re-fetch on next cycle
      }

    } else { // No Firebase user
      console.log('[AuthContext] CLIENT: No Firebase user (logged out or initial state).');
      if (profileLastFetchedForUid !== null) setProfileLastFetchedForUid(null);
      if (appUser !== null) setAppUser(null);
      if (isLoadingAppUser) setIsLoadingAppUser(false);

      if (!allPublicAndOnboardingPages.includes(pathname) && !pathname.startsWith('/_next/')) {
        console.log(`[AuthContext] CLIENT: Not on public/onboarding page (${pathname}) and no Firebase user. Redirecting to /login.`);
        ensureRedirect('/login');
      } else {
         console.log(`[AuthContext] CLIENT: No Firebase user, but on a public/onboarding page (${pathname}) or system path. No redirect needed.`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAuthCheckDone, firebaseUser, appUser, profileLastFetchedForUid, isLoadingAppUser, pathname, searchParams, fetchUserProfile, ensureRedirect, router]);


  const updateAppUser = useCallback((updatedProfileData: AppUser | null) => {
    console.log('[AuthContext] CLIENT: updateAppUser explicitly called with:', updatedProfileData ? updatedProfileData.email : 'null');
    setAppUser(updatedProfileData);
    // The main useEffect will pick up this appUser change and re-evaluate redirection.
  }, []);

  const handleFirebaseEmailPasswordSignup = async (email: string, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthClient, email, pass);
      console.log('[AuthContext] CLIENT: Firebase email signup successful for:', userCredential.user.email);
      // onAuthStateChanged will set firebaseUser. The useEffect will then handle fetching profile (which will be null) and redirecting.
      // Explicitly reset profileLastFetchedForUid to ensure profile is fetched for new UID
      setProfileLastFetchedForUid(null);
      return userCredential.user;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email signup error:', error.code, error.message);
      throw error;
    }
  };

  const handleFirebaseEmailPasswordLogin = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthClient, email, pass);
      console.log('[AuthContext] CLIENT: Firebase email login successful for:', userCredential.user.email);
      // Explicitly reset profileLastFetchedForUid to ensure profile is fetched for new UID
      setProfileLastFetchedForUid(null);
      return userCredential.user;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email login error:', error.code, error.message, error);
      throw error;
    }
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuthClient, provider);
      console.log('[AuthContext] CLIENT: Google sign-in successful for:', result.user.email);
      setProfileLastFetchedForUid(null);
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Google sign-in error:', error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    console.log('[AuthContext] CLIENT: Logging out...');
    try {
      await signOut(firebaseAuthClient);
      // onAuthStateChanged will set firebaseUser to null. The useEffect will then clear appUser and redirect.
      setProfileLastFetchedForUid(null); // Reset for next login
      setAppUser(null); // Clear appUser immediately
      console.log('[AuthContext] CLIENT: Firebase signOut successful.');
      ensureRedirect('/login'); // Explicit redirect after logout
    } catch (error) {
      console.error('[AuthContext] CLIENT: Error during Firebase signOut:', error);
    }
  };
  
  if (isLoading && !allPublicAndOnboardingPages.includes(pathname) && !pathname.startsWith('/_next/')) {
    console.log(`[AuthContext] CLIENT: Displaying global loading screen. initialAuthCheckDone: ${initialAuthCheckDone}, isLoadingAppUser: ${isLoadingAppUser}, pathname: ${pathname}`);
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Initializing session...</p>
      </div>
    );
  }

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

