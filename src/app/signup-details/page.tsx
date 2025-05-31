
// src/app/signup-details/page.tsx
import type { Metadata } from 'next';
import SignupDetailsForm from '@/components/auth/SignupDetailsForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Complete Your Profile - FPX Markets',
  description: 'Provide additional details to complete your FPX Markets account setup.',
};

export default function SignupDetailsPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Almost There!</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Please provide a few more details to complete your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupDetailsForm />
        </CardContent>
      </Card>
    </div>
  );
}
