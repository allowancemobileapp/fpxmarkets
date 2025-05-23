import type { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up - FPX Markets',
  description: 'Create your FPX Markets account.',
};

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <Coins className="h-12 w-12 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Create Your Account</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Join FPX Markets and start your trading journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
         <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" passHref>
              <span className="font-medium text-primary hover:underline cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
