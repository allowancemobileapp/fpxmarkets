'use client';

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PinSetupFormSchema, type PinSetupFormValues } from '@/lib/types';
import { handlePinSetup } from '@/lib/actions'; // Simulated action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PinSetupForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { completePinSetup, user } = useAuth();
  const router = useRouter();

  const form = useForm<PinSetupFormValues>({
    resolver: zodResolver(PinSetupFormSchema),
    defaultValues: {
      pin1: '', pin2: '', pin3: '', pin4: '',
      confirmPin1: '', confirmPin2: '', confirmPin3: '', confirmPin4: '',
    },
  });

  const pinInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldGroup: 'pin' | 'confirmPin'
  ) => {
    const value = e.target.value;
    const groupRefs = fieldGroup === 'pin' ? pinInputsRef : confirmPinInputsRef;
    const fieldNameBase = fieldGroup === 'pin' ? 'pin' : 'confirmPin';

    form.setValue(`${fieldNameBase}${index + 1}` as keyof PinSetupFormValues, value);

    if (value && index < 3) {
      groupRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    fieldGroup: 'pin' | 'confirmPin'
  ) => {
    const groupRefs = fieldGroup === 'pin' ? pinInputsRef : confirmPinInputsRef;
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      groupRefs.current[index - 1]?.focus();
    }
  };


  async function onSubmit(values: PinSetupFormValues) {
    setIsLoading(true);
    const fullPin = `${values.pin1}${values.pin2}${values.pin3}${values.pin4}`;
    // Simulate API call
    const result = await handlePinSetup({ pin: fullPin, userId: user?.id || 'unknown' }); // Simulated action
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'PIN Setup Successful',
        description: 'Your Trading PIN has been set.',
      });
      completePinSetup(); // Update AuthContext and redirect
    } else {
      toast({
        title: 'PIN Setup Failed',
        description: result.message || 'Could not set PIN. Please try again.',
        variant: 'destructive',
      });
    }
  }
  // Redirect if user is not available or PIN already set
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.pinSetupCompleted) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.pinSetupCompleted) {
    return <div className="text-center p-8"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> <p className="mt-4">Loading...</p></div>;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <FormLabel>Enter 4-Digit PIN</FormLabel>
          <div className="flex justify-center space-x-2 mt-2">
            {([0, 1, 2, 3] as const).map((index) => (
              <FormField
                key={`pin${index}`}
                control={form.control}
                name={`pin${index + 1}` as keyof PinSetupFormValues}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormControl>
                      <Input
                        {...field}
                        ref={(el) => (pinInputsRef.current[index] = el)}
                        type="password" // Use password for masking, or text with custom styling
                        maxLength={1}
                        className="text-center text-2xl h-14"
                        onChange={(e) => handleInputChange(e, index, 'pin')}
                        onKeyDown={(e) => handleKeyDown(e, index, 'pin')}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-center" />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <FormLabel>Confirm 4-Digit PIN</FormLabel>
          <div className="flex justify-center space-x-2 mt-2">
            {([0, 1, 2, 3] as const).map((index) => (
              <FormField
                key={`confirmPin${index}`}
                control={form.control}
                name={`confirmPin${index + 1}` as keyof PinSetupFormValues}
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormControl>
                      <Input
                        {...field}
                        ref={(el) => (confirmPinInputsRef.current[index] = el)}
                        type="password"
                        maxLength={1}
                        className="text-center text-2xl h-14"
                        onChange={(e) => handleInputChange(e, index, 'confirmPin')}
                        onKeyDown={(e) => handleKeyDown(e, index, 'confirmPin')}
                      />
                    </FormControl>
                     <FormMessage className="text-xs text-center" />
                  </FormItem>
                )}
              />
            ))}
          </div>
           {/* Display general error for PIN mismatch here */}
            {form.formState.errors.confirmPin4 && form.formState.errors.confirmPin4.message === "PINs do not match." && (
              <p className="text-sm font-medium text-destructive text-center mt-2">
                PINs do not match.
              </p>
            )}
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Set Trading PIN'}
        </Button>
      </form>
    </Form>
  );
}

// Need to import useRouter and useEffect from React
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
