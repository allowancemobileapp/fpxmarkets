
// src/components/auth/SignupDetailsForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupDetailsFormSchema, type SignupDetailsFormValues, type RegisterUserPayload, type AppUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { countries } from '@/config/countries';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { tradingPlans, type TradingPlan } from '@/config/tradingPlans';

export default function SignupDetailsForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { firebaseUser, appUser, updateAppUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const form = useForm<SignupDetailsFormValues>({
    resolver: zodResolver(SignupDetailsFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      accountType: 'Personal', // Default or from appUser if available
      phoneNumber: '',
      country: '', // Will hold the 2-letter country code
    },
  });
  
  useEffect(() => {
    if (!authIsLoading && !firebaseUser) {
      console.log('[SignupDetailsForm] No Firebase user found, redirecting to login.');
      router.push('/login');
    }
    if (!authIsLoading && appUser?.profile_completed_at) {
      console.log('[SignupDetailsForm] Profile already complete, redirecting based on PIN status.');
      if (!appUser.pin_setup_completed_at) {
        router.push('/setup-pin');
      } else {
        router.push('/dashboard');
      }
    }
    // Pre-fill form if appUser data becomes available (e.g., on page refresh if partially completed)
    if (appUser) {
      form.reset({
        firstName: appUser.first_name || '',
        lastName: appUser.last_name || '',
        username: appUser.username || '',
        accountType: appUser.account_type || 'Personal', // Ensure this maps to a valid plan value
        phoneNumber: appUser.phone_number || '',
        country: appUser.country_code || '', // Use country_code here
      });
    }
  }, [firebaseUser, appUser, authIsLoading, router, form]);


  async function onSubmit(values: SignupDetailsFormValues) {
    console.log('[SignupDetailsForm] CLIENT: Form submitted with values:', values);
    if (!firebaseUser || !firebaseUser.email) {
      toast({ title: 'Error', description: 'User session not found. Please try logging in again.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    // The RegisterUserRequestSchema's transform will handle renaming 'country' to 'country_code' if needed,
    // but since 'country' field in form values already holds the code, it's fine.
    const payload: Omit<RegisterUserPayload, 'country_code'> & { country: string } = { 
      ...values, // `country` here is the 2-letter code from the form
      email: firebaseUser.email,
      firebaseAuthUid: firebaseUser.uid,
    };
    console.log('[SignupDetailsForm] CLIENT: Payload for API:', payload);


    try {
      const response = await fetch('/api/auth/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send values as is, API schema will parse
      });

      const result = await response.json();
      console.log('[SignupDetailsForm] CLIENT: API response status:', response.status);
      console.log('[SignupDetailsForm] CLIENT: API response body:', result);


      if (response.ok) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile details have been saved.',
        });
        updateAppUser(result as AppUser); // AuthContext will handle redirect to /setup-pin
      } else {
        toast({
          title: 'Update Failed',
          description: result.message || 'Could not update profile.',
          variant: 'destructive',
        });
         console.error('[SignupDetailsForm] CLIENT: Update failed, API errors:', result.errors || result.detail);
      }
    } catch (error) {
      console.error("[SignupDetailsForm] CLIENT: Error submitting signup details:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (authIsLoading || !firebaseUser) { // Basic loading check
    return <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2">Loading user data...</p></div>;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Account Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {tradingPlans.map((plan: TradingPlan) => (
                    <FormItem 
                      key={plan.value} 
                      className="flex flex-col items-start space-y-1 border p-4 rounded-md hover:bg-muted/50 transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                      data-state={field.value === plan.value ? "checked" : "unchecked"}
                    >
                      <div className="flex items-center w-full">
                        <FormControl>
                          <RadioGroupItem value={plan.value} id={`account-type-${plan.value}`} />
                        </FormControl>
                        <FormLabel htmlFor={`account-type-${plan.value}`} className="font-medium ml-2 cursor-pointer flex-1">
                          {plan.label}
                        </FormLabel>
                      </div>
                      <FormDescription className="text-xs text-muted-foreground pl-6">
                        Min. Deposit: ${plan.minimumDeposit.toLocaleString()}
                      </FormDescription>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username *</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>Your unique display name (letters, numbers, underscores only).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country * (Select your 2-letter code)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>{country.label} ({country.value})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>This will be stored as your country code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading || authIsLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save and Continue'}
        </Button>
      </form>
    </Form>
  );
}
