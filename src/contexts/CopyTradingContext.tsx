
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CopyTradingContextType {
  copiedTraderIds: Set<string>;
  toggleCopyTrader: (traderId: string, traderName: string) => Promise<void>; // Make it async
  isTraderCopied: (traderId: string) => boolean;
  getCopiedTradersCount: () => number;
  isLoading: boolean; // Add a loading state
}

const CopyTradingContext = createContext<CopyTradingContextType | undefined>(undefined);

export function CopyTradingProvider({ children }: { children: ReactNode }) {
  const [copiedTraderIds, setCopiedTraderIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { appUser, initialAuthCheckDone } = useAuth();
  const { toast } = useToast();

  // Fetch initial data from the database
  useEffect(() => {
    if (!initialAuthCheckDone) {
      return; // Wait for auth check to complete
    }

    if (appUser?.firebase_auth_uid) {
      setIsLoading(true);
      fetch(`/api/user/copy-traders?firebaseAuthUid=${appUser.firebase_auth_uid}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch copied traders');
          }
          return res.json();
        })
        .then(data => {
          setCopiedTraderIds(new Set(data.traderIds || []));
        })
        .catch(error => {
          console.error("Error fetching copied traders from DB:", error);
          toast({
            title: "Error",
            description: "Could not load your list of copied traders.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // User is logged out or no appUser yet, clear the list and finish loading
      setCopiedTraderIds(new Set());
      setIsLoading(false);
    }
  }, [appUser, initialAuthCheckDone, toast]);

  const toggleCopyTrader = useCallback(async (traderId: string, traderName: string) => {
    if (!appUser?.firebase_auth_uid) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to copy traders.",
        variant: "destructive",
      });
      return;
    }

    const isCurrentlyCopied = copiedTraderIds.has(traderId);
    const originalIds = new Set(copiedTraderIds);
    let toastTitle = "";
    let toastMessage = "";

    // Optimistic UI update
    const newIds = new Set(originalIds);
    if (isCurrentlyCopied) {
      newIds.delete(traderId);
      toastTitle = "Copy Stopped";
      toastMessage = `You have stopped copying ${traderName}.`;
    } else {
      newIds.add(traderId);
      toastTitle = "Copy Started";
      toastMessage = `You are now copying ${traderName}.`;
    }
    setCopiedTraderIds(newIds);

    try {
      const response = await fetch('/api/user/copy-traders', {
        method: isCurrentlyCopied ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseAuthUid: appUser.firebase_auth_uid,
          traderId: traderId,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const result = await response.json();
      console.log('Toggle copy trader result:', result);

      // Show success toast on successful API call
      setTimeout(() => {
        toast({
          title: toastTitle,
          description: toastMessage,
        });
      }, 0);

    } catch (error) {
      console.error('Failed to toggle copy trader:', error);
      // Revert UI if API call fails
      setCopiedTraderIds(originalIds);
      toast({
        title: "Error",
        description: `Could not ${isCurrentlyCopied ? 'stop' : 'start'} copying ${traderName}. Please try again.`,
        variant: "destructive",
      });
    }
  }, [appUser, copiedTraderIds, toast]);

  const isTraderCopied = useCallback((traderId: string): boolean => {
    return copiedTraderIds.has(traderId);
  }, [copiedTraderIds]);

  const getCopiedTradersCount = useCallback((): number => {
    return copiedTraderIds.size;
  }, [copiedTraderIds]);

  return (
    <CopyTradingContext.Provider value={{ copiedTraderIds, toggleCopyTrader, isTraderCopied, getCopiedTradersCount, isLoading }}>
      {children}
    </CopyTradingContext.Provider>
  );
}

export function useCopyTrading() {
  const context = useContext(CopyTradingContext);
  if (context === undefined) {
    throw new Error('useCopyTrading must be used within a CopyTradingProvider');
  }
  return context;
}
