import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Forgot Password - FPX Markets',
  description: 'Reset your FPX Markets account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <KeyRound className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Forgot Your Password?</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset your password. (This is a placeholder page).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled> {/* Disabled for placeholder */}
            Send Reset Link
          </Button>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{' '}
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
