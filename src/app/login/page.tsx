
import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login - FPX Markets',
  description: 'Login to your FPX Markets account.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <Coins className="h-12 w-12 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Welcome Back</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Login to access your FPX Markets dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <Link href="/forgot-password" passHref>
            <span className="text-sm text-primary hover:underline cursor-pointer">
              Forgot Password?
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" passHref>
              <span className="font-medium text-primary hover:underline cursor-pointer">
                Sign Up
              </span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
