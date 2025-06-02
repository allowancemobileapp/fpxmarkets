
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpCircle, DollarSign, AlertTriangle, Banknote, CreditCard, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormItem } from '@/components/ui/form'; 
import { countries } from '@/config/countries';


const bankWithdrawalFormSchema = z.object({
  amountUSD: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().min(50, "Withdrawal amount must be at least $50.") 
  ),
  bankName: z.string().min(3, "Bank name is required.").max(100),
  accountHolderName: z.string().min(3, "Account holder name is required.").max(100),
  accountNumber: z.string().min(5, "Account number is required.").max(30).regex(/^[a-zA-Z0-9-]+$/, "Account number contains invalid characters."),
  swiftBic: z.string().min(8, "SWIFT/BIC code must be 8-11 characters.").max(11).regex(/^[A-Z0-9]{8,11}$/, "Invalid SWIFT/BIC code format.").optional().or(z.literal('')),
  bankCountry: z.string().length(2, "Bank country is required."),
  // Optional additional fields
  iban: z.string().optional().or(z.literal('')),
  sortCode: z.string().optional().or(z.literal('')), // For UK
  routingNumber: z.string().optional().or(z.literal('')), // For US (ABA)
  notes: z.string().max(200, "Notes cannot exceed 200 characters.").optional().or(z.literal('')),
});


type BankWithdrawalFormValues = z.infer<typeof bankWithdrawalFormSchema>;

export default function WithdrawalPage() {
  const { toast } = useToast();
  
  const form = useForm<BankWithdrawalFormValues>({
    resolver: zodResolver(bankWithdrawalFormSchema),
    defaultValues: {
      amountUSD: 0,
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      swiftBic: '',
      bankCountry: '',
      iban: '',
      sortCode: '',
      routingNumber: '',
      notes: '',
    },
  });

  const { control, handleSubmit, formState: { errors }, register } = form;
  
  const onSubmit = (data: BankWithdrawalFormValues) => {
    console.log("Bank withdrawal request submitted:", data);
    toast({
      title: "Withdrawal Request Submitted (Bank)",
      description: `Your bank withdrawal of $${data.amountUSD.toFixed(2)} is being processed. This is a UI demonstration.`,
    });
    form.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <ArrowUpCircle className="mr-3 h-8 w-8" /> Withdraw Funds to Bank
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Request Bank Withdrawal</CardTitle>
            <CardDescription>Enter your bank details and the amount you wish to withdraw.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <AlertTitle>Processing Times & Fees</AlertTitle>
                <AlertDescription>
                  Bank withdrawals may take 3-5 business days to process. Fees may be applied by intermediary banks. Minimum withdrawal is $50.
                </AlertDescription>
              </Alert>

              <FormItem>
                <Label htmlFor="amountUSD" className="text-base">Amount (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="amountUSD"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100"
                    className="pl-10 h-12 text-base"
                    {...register("amountUSD")}
                  />
                </div>
                {errors.amountUSD && <p className="text-sm font-medium text-destructive">{errors.amountUSD.message}</p>}
              </FormItem>

              <FormItem>
                <Label htmlFor="accountHolderName" className="text-base">Account Holder Name *</Label>
                <Input id="accountHolderName" placeholder="John Doe" className="h-12 text-base" {...register("accountHolderName")} />
                {errors.accountHolderName && <p className="text-sm font-medium text-destructive">{errors.accountHolderName.message}</p>}
              </FormItem>

              <FormItem>
                <Label htmlFor="bankName" className="text-base">Bank Name *</Label>
                <Input id="bankName" placeholder="e.g., Global First Bank" className="h-12 text-base" {...register("bankName")} />
                {errors.bankName && <p className="text-sm font-medium text-destructive">{errors.bankName.message}</p>}
              </FormItem>
              
              <FormItem>
                <Label htmlFor="accountNumber" className="text-base">Account Number *</Label>
                <Input id="accountNumber" placeholder="e.g., 1234567890" className="h-12 text-base" {...register("accountNumber")} />
                {errors.accountNumber && <p className="text-sm font-medium text-destructive">{errors.accountNumber.message}</p>}
              </FormItem>
              
              <FormItem>
                <Label htmlFor="swiftBic" className="text-base">SWIFT/BIC Code (Optional)</Label>
                <Input id="swiftBic" placeholder="e.g., BANKUS33" className="h-12 text-base" {...register("swiftBic")} />
                {errors.swiftBic && <p className="text-sm font-medium text-destructive">{errors.swiftBic.message}</p>}
              </FormItem>

              <Controller
                name="bankCountry"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-base">Bank Country *</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select bank's country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.value} value={country.value} className="text-base py-2">
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bankCountry && <p className="text-sm font-medium text-destructive">{errors.bankCountry.message}</p>}
                  </FormItem>
                )}
              />
              
              <FormItem>
                <Label htmlFor="notes" className="text-base">Notes (Optional)</Label>
                <Input id="notes" placeholder="Any specific instructions" className="h-12 text-base" {...register("notes")} />
                {errors.notes && <p className="text-sm font-medium text-destructive">{errors.notes.message}</p>}
              </FormItem>


            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full sm:w-auto" variant="destructive">
                Request Bank Withdrawal
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="md:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Landmark className="mr-2 h-6 w-6 text-primary"/>Important Notes for Bank Withdrawal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Verification</AlertTitle>
              <AlertDescription>
                Withdrawals to new bank accounts may require additional verification for security purposes.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Correct Details</AlertTitle>
              <AlertDescription>
                Ensure all bank details are accurate. Incorrect information can lead to delays or failed transactions. FPX Markets is not responsible for losses due to incorrect details provided.
              </AlertDescription>
            </Alert>
             <p className="text-sm text-muted-foreground">
                If you encounter any issues, please contact <a href="/dashboard/support" className="text-primary hover:underline">Support</a>.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
