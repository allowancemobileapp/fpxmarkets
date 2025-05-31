
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
      firstName: appUser?.first_name || '',
      lastName: appUser?.last_name || '',
      username: appUser?.username || '',
      accountType: appUser?.account_type || 'Personal',
      phoneNumber: appUser?.phone_number || '',
      country: appUser?.country || '',
    },
  });
  
  useEffect(() => {
    if (!authIsLoading && !firebaseUser) {
      console.log('[SignupDetailsForm] No Firebase user found, redirecting to login.');
      router.push('/login');
    }
     // Pre-fill form if appUser data becomes available after initial load
    if (appUser) {
      form.reset({
        firstName: appUser.first_name || '',
        lastName: appUser.last_name || '',
        username: appUser.username || '',
        accountType: appUser.account_type || 'Personal',
        phoneNumber: appUser.phone_number || '',
        country: appUser.country || '',
      });
    }
  }, [firebaseUser, appUser, authIsLoading, router, form]);


  async function onSubmit(values: SignupDetailsFormValues) {
    if (!firebaseUser || !firebaseUser.email) {
      toast({ title: 'Error', description: 'User session not found. Please try logging in again.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const payload: RegisterUserPayload = {
      ...values,
      email: firebaseUser.email,
      firebaseAuthUid: firebaseUser.uid,
    };

    try {
      const response = await fetch('/api/auth/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

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
      }
    } catch (error) {
      console.error("Error submitting signup details:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (authIsLoading || !firebaseUser) {
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
              <FormLabel>Country *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
