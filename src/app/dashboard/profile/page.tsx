
'use client';
// This page now primarily imports and renders the main content component.
import DashboardProfilePageContent from '@/components/dashboard/DashboardProfilePageContent';

export default function ProfilePage() {
  // Auth guard (redirect if not authenticated or profile not complete) is handled by DashboardLayout
  return <DashboardProfilePageContent />;
}
