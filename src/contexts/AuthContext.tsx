
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AccountType } from '@/lib/types'; // Added AccountType

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void; 
  signup: (userData: User) => void; 
  logout: () => void;
  completePinSetup: () => void;
  // hasMadeFirstDeposit: boolean; // Could be added for more complex deposit logic
  // setIsFirstDepositState: (value: boolean) => void; // Example if we manage first deposit state here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Simulate checking auth status on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('fpxUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      // Redirect based on profile completion status - this logic might be too aggressive
      // and better handled by individual page guards or DashboardLayout
      // if (!parsedUser.profileCompleted) {
      //   router.push('/signup'); 
      // } else if (!parsedUser.pinSetupCompleted) {
      //   router.push('/setup-pin');
      // }
    }
    setLoading(false);
  }, [router]);

  const login = (userData: User) => {
    const loggedInUser: User = { 
        ...userData, 
        profileCompleted: true, // Assume profile is complete after they log in if they exist
        // pinSetupCompleted will be based on what's in userData (from mock DB or real DB)
    };
    setUser(loggedInUser);
    localStorage.setItem('fpxUser', JSON.stringify(loggedInUser));
    if (!loggedInUser.pinSetupCompleted) {
      router.push('/setup-pin');
    } else {
      router.push('/dashboard');
    }
  };
  
  const signup = (userData: User) => {
    const signedUpUser: User = { 
        ...userData, 
        profileCompleted: true, // Signup form completes the profile part
        pinSetupCompleted: false, // PIN setup is next
    };
    setUser(signedUpUser);
    localStorage.setItem('fpxUser', JSON.stringify(signedUpUser));
    router.push('/setup-pin'); 
  };

  const logout = () => {
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
