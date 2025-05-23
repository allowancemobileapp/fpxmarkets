import type { Metadata } from 'next';
import PinSetupForm from '@/components/auth/PinSetupForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldLock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Set Up Trading PIN - FPX Markets',
  description: 'Set up your secure 4-digit Trading PIN for FPX Markets.',
};

export default function SetupPinPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <ShieldLock className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Set Your Trading PIN</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            This 4-digit PIN will be used to authorize trades and sensitive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PinSetupForm />
        </CardContent>
      </Card>
    </div>
  );
}
