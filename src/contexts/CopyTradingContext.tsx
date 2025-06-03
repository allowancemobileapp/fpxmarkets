
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CopyTradingContextType {
  copiedTraderIds: Set<string>;
  toggleCopyTrader: (traderId: string, traderName: string) => void;
  isTraderCopied: (traderId: string) => boolean;
  getCopiedTradersCount: () => number;
}

const CopyTradingContext = createContext<CopyTradingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'fpx_copied_trader_ids';

export function CopyTradingProvider({ children }: { children: ReactNode }) {
  const [copiedTraderIds, setCopiedTraderIds] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load from localStorage on initial mount
    try {
      const storedIds = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedIds) {
        setCopiedTraderIds(new Set(JSON.parse(storedIds)));
      }
    } catch (error) {
      console.error("Error reading copied traders from localStorage:", error);
      // Fallback to empty set if parsing fails
      setCopiedTraderIds(new Set());
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever copiedTraderIds changes, but only after initialization
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(copiedTraderIds)));
      } catch (error) {
        console.error("Error saving copied traders to localStorage:", error);
      }
    }
  }, [copiedTraderIds, isInitialized]);

  const toggleCopyTrader = useCallback((traderId: string, traderName: string) => {
    setCopiedTraderIds(prevIds => {
      const newIds = new Set(prevIds);
      let toastMessage = "";
      let toastTitle = "";

      if (newIds.has(traderId)) {
        newIds.delete(traderId);
        toastTitle = "Copy Stopped";
        toastMessage = `You have stopped copying ${traderName}.`;
      } else {
        newIds.add(traderId);
        toastTitle = "Copy Started";
        toastMessage = `You are now copying ${traderName}.`;
      }
      
      // Defer toast to avoid state update issues during render
      setTimeout(() => {
        toast({
          title: toastTitle,
          description: toastMessage,
        });
      }, 0);
      
      return newIds;
    });
  }, [toast]);

  const isTraderCopied = useCallback((traderId: string): boolean => {
    return copiedTraderIds.has(traderId);
  }, [copiedTraderIds]);

  const getCopiedTradersCount = useCallback((): number => {
    return copiedTraderIds.size;
  }, [copiedTraderIds]);

  if (!isInitialized) {
    // Optional: Render a loader or null while initializing from localStorage
    // For simplicity, children are rendered, but context values might not be fully ready.
    // A proper loader here would prevent children from accessing potentially incomplete state.
    return null; // Or a loading spinner
  }

  return (
    <CopyTradingContext.Provider value={{ copiedTraderIds, toggleCopyTrader, isTraderCopied, getCopiedTradersCount }}>
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
