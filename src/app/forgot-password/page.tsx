
'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, Mail, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { auth as firebaseAuthClient } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

// export const metadata: Metadata = { // Cannot use metadata in client component
//   title: 'Forgot Password - FPX Markets',
//   description: 'Reset your FPX Markets account password.',
// };

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    setEmailSent(false);
    try {
      await sendPasswordResetEmail(firebaseAuthClient, values.email);
      toast({
        title: 'Password Reset Email Sent',
        description: `If an account exists for ${values.email}, you will receive an email with instructions to reset your password.`,
      });
      setEmailSent(true);
      form.reset();
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      let errorMessage = "Failed to send password reset email. Please try again.";
      if (error.code === 'auth/user-not-found') {
        // To avoid user enumeration, we give a generic message even if user not found
        toast({
          title: 'Password Reset Email Sent',
          description: `If an account exists for ${values.email}, you will receive an email with instructions to reset your password.`,
        });
         setEmailSent(true); // Still set to true to give consistent UI
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
           <KeyRound className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Forgot Your Password?</CardTitle>
          {!emailSent ? (
            <CardDescription className="mt-2 text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </CardDescription>
          ) : (
            <CardDescription className="mt-2 text-positive font-semibold">
              Check your inbox! If an account exists for the email you provided, a reset link has been sent.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!emailSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email-forgot" className="text-left">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          id="email-forgot"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">
                Didn&apos;t receive an email? Check your spam folder or try again after a few minutes.
              </p>
            </div>
          )}
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
