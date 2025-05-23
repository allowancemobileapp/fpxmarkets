'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void; // Simulate login
  signup: (userData: User) => void; // Simulate signup
  logout: () => void;
  completePinSetup: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulate checking auth status on mount
  useEffect(() => {
    // In a real app, check Firebase Auth state or a token
    const storedUser = localStorage.getItem('fpxUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      // Redirect based on profile completion status
      if (!parsedUser.profileCompleted) {
        router.push('/signup'); // Or a specific profile completion step
      } else if (!parsedUser.pinSetupCompleted) {
        router.push('/setup-pin');
      }
    }
    setLoading(false);
  }, [router]);

  const login = (userData: User) => {
    // Simulate login: In a real app, this would come after Firebase Auth success
    const loggedInUser = { ...userData, profileCompleted: true, pinSetupCompleted: false }; // Assume PIN not set on fresh login
    setUser(loggedInUser);
    localStorage.setItem('fpxUser', JSON.stringify(loggedInUser));
    if (!loggedInUser.pinSetupCompleted) {
      router.push('/setup-pin');
    } else {
      router.push('/dashboard');
    }
  };
  
  const signup = (userData: User) => {
    // Simulate signup: In a real app, this would come after Firebase Auth success
    // and initial profile data is saved.
    const signedUpUser = { ...userData, profileCompleted: true, pinSetupCompleted: false };
    setUser(signedUpUser);
    localStorage.setItem('fpxUser', JSON.stringify(signedUpUser));
    router.push('/setup-pin'); // Proceed to PIN setup
  };

  const logout = () => {
    // Simulate logout: In a real app, call Firebase signOut
    setUser(null);
    localStorage.removeItem('fpxUser');
    router.push('/login');
  };

  const completePinSetup = () => {
    if (user) {
      const updatedUser = { ...user, pinSetupCompleted: true };
      setUser(updatedUser);
      localStorage.setItem('fpxUser', JSON.stringify(updatedUser));
      router.push('/dashboard');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, completePinSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
