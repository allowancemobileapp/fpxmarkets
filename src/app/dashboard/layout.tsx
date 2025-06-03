
'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { CopyTradingProvider } from '@/contexts/CopyTradingContext'; // Import CopyTradingProvider
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { appUser, initialAuthCheckDone } = useAuth();
  const router = useRouter();

  const layoutIsLoading = !initialAuthCheckDone;

  useEffect(() => {
    if (!initialAuthCheckDone) {
      console.log('[DashboardLayout] Waiting for initial auth check to complete.');
      return;
    }

    console.log(`[DashboardLayout] Effect running. initialAuthCheckDone: ${initialAuthCheckDone}, appUser: ${!!appUser}`);
    if (!appUser) {
      console.log('[DashboardLayout] No appUser, redirecting to login.');
      router.push('/login');
    } else if (appUser && !appUser.profile_completed_at) {
      console.log('[DashboardLayout] Profile not complete, redirecting to /signup-details.');
      router.push('/signup-details'); 
    } else if (appUser && !appUser.pin_setup_completed_at) {
      console.log('[DashboardLayout] PIN not set up, redirecting to /setup-pin.');
      router.push('/setup-pin');
    }
    console.log('[DashboardLayout] User is authorized for dashboard.');

  }, [appUser, initialAuthCheckDone, router]);

  if (layoutIsLoading || !appUser || !appUser.profile_completed_at || !appUser.pin_setup_completed_at) {
    console.log(`[DashboardLayout] Showing loader. layoutIsLoading: ${layoutIsLoading}, appUser: ${!!appUser}, profile_completed: ${!!appUser?.profile_completed_at}, pin_completed: ${!!appUser?.pin_setup_completed_at}`);
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  console.log('[DashboardLayout] Rendering dashboard structure.');
  return (
    <CopyTradingProvider> {/* Wrap with CopyTradingProvider */}
      <div className="flex min-h-screen bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </CopyTradingProvider>
  );
}
