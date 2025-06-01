
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Added useSearchParams
import { type User as FirebaseUser, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuthClient } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // For redirect after login

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
        console.log('[AuthContext] CLIENT: Profile not found (404) for UID:', uid);
        return null;
      }
      const responseText = await response.text().catch(() => 'Could not read error response body');
      console.error(`[AuthContext] CLIENT: Error fetching profile. Status: ${response.status}. Response: ${responseText.substring(0, 500)}`);
      return null;
    } catch (error) {
      console.error('[AuthContext] CLIENT: Network or other error fetching profile:', error);
      return null;
    }
  }, []);

  const ensureRedirect = useCallback((targetPath: string) => {
    if (pathname !== targetPath) {
      console.log(`[AuthContext] CLIENT: Redirecting from ${pathname} to ${targetPath}`);
      router.push(targetPath);
    } else {
      console.log(`[AuthContext] CLIENT: Already on target path ${targetPath}, no redirect needed.`);
    }
  }, [pathname, router]);
  

  useEffect(() => {
    console.log('[AuthContext] CLIENT: Setting up Firebase onAuthStateChanged listener.');
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(firebaseAuthClient, async (fbUser) => {
      console.log('[AuthContext] CLIENT: onAuthStateChanged triggered. Firebase user UID:', fbUser ? fbUser.uid : 'null');
      setFirebaseUser(fbUser);

      if (fbUser) {
        const profile = await fetchUserProfile(fbUser.uid);
        setAppUser(profile); // Update appUser state immediately

        if (profile) {
          console.log('[AuthContext] CLIENT: AppUser profile found:', profile);
          if (!profile.profile_completed_at) {
            console.log('[AuthContext] CLIENT: Profile not complete, ensuring redirect to /signup-details.');
            ensureRedirect('/signup-details');
          } else if (!profile.pin_setup_completed_at) {
            console.log('[AuthContext] CLIENT: PIN not set up, ensuring redirect to /setup-pin.');
            ensureRedirect('/setup-pin');
          } else {
            console.log('[AuthContext] CLIENT: User fully set up.');
            const redirectUrl = searchParams.get('redirectUrl') || '/dashboard';
            if (!pathname.startsWith('/dashboard') && pathname !== redirectUrl.split('?')[0]) { // Avoid redirect if already on dashboard or target
                 ensureRedirect(redirectUrl);
            }
          }
        } else {
          // This is the critical path for a NEW Firebase user or if profile fetch failed for an existing user
          console.log('[AuthContext] CLIENT: AppUser profile NOT found for Firebase UID:', fbUser.uid, '(New user or API error). Ensuring redirect to /signup-details.');
          ensureRedirect('/signup-details');
        }
      } else {
        // No Firebase user
        setAppUser(null);
        if (!allPublicAndOnboardingPages.includes(pathname) && !pathname.startsWith('/_next/')) {
          console.log('[AuthContext] CLIENT: No Firebase user, not on public/onboarding page. Current path:', pathname, 'Ensuring redirect to /login.');
          ensureRedirect('/login');
        } else {
           console.log('[AuthContext] CLIENT: No Firebase user, already on a public/onboarding page or no redirect needed. Path:', pathname);
        }
      }
      setIsLoading(false);
      console.log('[AuthContext] CLIENT: Finished processing auth state change. isLoading is now false.');
    });

    return () => {
      console.log('[AuthContext] CLIENT: Cleaning up Firebase onAuthStateChanged listener.');
      unsubscribe();
    };
  }, [fetchUserProfile, ensureRedirect, pathname, searchParams]); // Added searchParams

  const updateAppUser = useCallback((updatedProfileData: AppUser | null) => {
    console.log('[AuthContext] CLIENT: updateAppUser called with:', updatedProfileData);
    setAppUser(updatedProfileData);
    // After updating, the main useEffect will re-evaluate and redirect if necessary
    // For example, if profile_completed_at is now set, it should redirect from /signup-details to /setup-pin
    if (updatedProfileData?.profile_completed_at && !updatedProfileData?.pin_setup_completed_at) {
        ensureRedirect('/setup-pin');
    } else if (updatedProfileData?.profile_completed_at && updatedProfileData?.pin_setup_completed_at) {
        const redirectUrl = searchParams.get('redirectUrl') || '/dashboard';
        ensureRedirect(redirectUrl);
    }
  }, [ensureRedirect, searchParams]);


  const handleFirebaseEmailPasswordSignup = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthClient, email, pass);
      console.log('[AuthContext] CLIENT: Firebase email signup successful for:', userCredential.user.email);
      // onAuthStateChanged will handle setting firebaseUser, fetching profile (which will be null), and redirecting to /signup-details
      return userCredential.user;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email signup error:', error.code, error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const handleFirebaseEmailPasswordLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthClient, email, pass);
      console.log('[AuthContext] CLIENT: Firebase email login successful for:', userCredential.user.email);
      // onAuthStateChanged will handle this
      return userCredential.user;
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Firebase email login error:', error.code, error.message, error);
      setIsLoading(false);
      throw error;
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuthClient, provider);
      console.log('[AuthContext] CLIENT: Google sign-in successful for:', result.user.email);
      // onAuthStateChanged will handle this
    } catch (error: any) {
      console.error('[AuthContext] CLIENT: Google sign-in error:', error.code, error.message);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    console.log('[AuthContext] CLIENT: Logging out...');
    setIsLoading(true);
    try {
      await signOut(firebaseAuthClient);
      setFirebaseUser(null); // Explicitly clear firebaseUser
      setAppUser(null);    // Explicitly clear appUser
      console.log('[AuthContext] CLIENT: Firebase signOut successful. Redirecting to /login.');
      ensureRedirect('/login'); // Ensure redirect after state clear
    } catch (error) {
      console.error('[AuthContext] CLIENT: Error during Firebase signOut:', error);
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Initializing session...</p>
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
