
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormSchema, type SignupFormValues, type User, type AccountType } from '@/lib/types';
import { handleSignup } from '@/lib/actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { countries } from '@/config/countries';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { tradingPlans, type TradingPlan } from '@/config/tradingPlans';


export default function SignupForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      accountType: 'Personal', // Default value
      country: '',
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    const result = await handleSignup(values);
    setIsLoading(false);

    if (result.success && result.user) {
      setConfirmedEmail(result.user.email as string);
      setShowConfirmation(true);
    } else {
      toast({
        title: 'Signup Failed',
        description: result.message || 'Could not create account. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handleProceedAfterConfirmation = () => {
    const formValues = form.getValues();
    const simulatedUser: User = {
      id: Date.now().toString(), 
      email: formValues.email,
      username: formValues.username,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      accountType: formValues.accountType,
      phoneNumber: formValues.phoneNumber,
      country: formValues.country,
      profileCompleted: true, 
      pinSetupCompleted: false, 
    };
    signup(simulatedUser); 
  };

  if (showConfirmation) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/30">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-700 dark:text-green-300">Signup Successful!</AlertTitle>
        <AlertDescription className="text-green-600 dark:text-green-400">
          Thank you for signing up! A confirmation link has been sent to <strong>{confirmedEmail}</strong>. Please check your inbox.
          <br /> (This is a simulation. No email was actually sent.)
        </AlertDescription>
        <Button onClick={handleProceedAfterConfirmation} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
          Proceed to PIN Setup
        </Button>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Account Type</FormLabel>
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
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>This will be your unique display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
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
              <FormLabel>Country</FormLabel>
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
