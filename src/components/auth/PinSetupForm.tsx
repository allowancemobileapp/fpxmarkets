
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PinSetupFormSchema, type PinSetupFormValues, type SetupPinPayload, type AppUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PinSetupForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { firebaseUser, appUser, updateAppUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const form = useForm<PinSetupFormValues>({
    resolver: zodResolver(PinSetupFormSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  const pinInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Function to combine individual pin digits into a single string
  const getCombinedPin = (baseName: 'pin' | 'confirmPin'): string => {
    let combined = '';
    for (let i = 1; i <= 4; i++) {
      combined += form.getValues((baseName + i) as keyof PinSetupFormValues<false>) || '';
    }
    return combined;
  };
  
  // Modified PinSetupFormValues to work with individual inputs if desired by schema
  // For this simplified schema, we'll use single fields for pin and confirmPin
  // type PinSetupFormValuesWithDigits = PinSetupFormValues & {
  //   pin1?: string; pin2?: string; pin3?: string; pin4?: string;
  //   confirmPin1?: string; confirmPin2?: string; confirmPin3?: string; confirmPin4?: string;
  // };


  useEffect(() => {
    if (!authIsLoading && !firebaseUser) {
      console.log('[PinSetupForm] No Firebase user, redirecting to login.');
      router.push('/login');
    } else if (!authIsLoading && appUser && !appUser.profile_completed_at) {
      console.log('[PinSetupForm] Profile not complete, redirecting to /signup-details.');
      router.push('/signup-details');
    } else if (!authIsLoading && appUser && appUser.pin_setup_completed_at) {
      console.log('[PinSetupForm] PIN already set up, redirecting to dashboard.');
      router.push('/dashboard');
    }
  }, [firebaseUser, appUser, authIsLoading, router]);


  async function onSubmit(values: PinSetupFormValues) {
    setIsLoading(true);
    if (!firebaseUser) {
      toast({ title: 'Error', description: 'User session not found.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const payload: SetupPinPayload = {
      firebaseAuthUid: firebaseUser.uid,
      pin: values.pin, // Use the combined pin from the form field
    };

    try {
      const response = await fetch('/api/auth/setup-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'PIN Setup Successful',
          description: 'Your Trading PIN has been set.',
        });
        updateAppUser(result as AppUser); // AuthContext will handle redirect to /dashboard
      } else {
        toast({
          title: 'PIN Setup Failed',
          description: result.message || 'Could not set PIN. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Error setting up PIN:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during PIN setup.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (authIsLoading || !firebaseUser || !appUser || !appUser.profile_completed_at) {
     return <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2">Loading user data...</p></div>;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter 4-Digit PIN</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password" 
                  maxLength={4}
                  placeholder="••••"
                  className="text-center text-2xl h-14 tracking-[.5em]"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs text-center" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm 4-Digit PIN</FormLabel>
              <FormControl>
                 <Input
                  {...field}
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  className="text-center text-2xl h-14 tracking-[.5em]"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
                    field.onChange(val);
                  }}
                />
              </FormControl>
              <FormMessage className="text-xs text-center" />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading || authIsLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Set Trading PIN'}
        </Button>
      </form>
    </Form>
  );
}
