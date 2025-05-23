
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpCircle, DollarSign, Bitcoin, AlertTriangle, Banknote, CreditCard } from 'lucide-react'; // Ethereum and Solana might use a generic crypto icon or specific ones if available
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormItem } from '@/components/ui/form'; // Ensure FormItem is imported

const cryptoWithdrawalOptions = [
  { value: 'BTC', label: 'Bitcoin', icon: <Bitcoin className="h-5 w-5" /> },
  { value: 'ETH', label: 'Ethereum', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 417" preserveAspectRatio="xMidYMid"><path fill="#343434" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.638V157.885z"/><path fill="#3C3C3B" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.6l127.963-177.959z"/><path fill="#8C8C8C" d="m127.962 416.905v-104.72L0 239.625z"/><path fill="#141414" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/><path fill="#393939" d="m.001 212.321l127.96 75.637V154.159z"/></svg> },
  { value: 'USDT', label: 'USDT (TRC20)', icon: <DollarSign className="h-5 w-5" /> },
  { value: 'SOL', label: 'Solana', icon: <Banknote className="h-5 w-5" /> }, // Using Banknote as a generic icon for Solana
];

const withdrawalFormSchema = z.object({
  method: z.string().min(1, "Please select a withdrawal method."),
  amountUSD: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().min(10, "Withdrawal amount must be at least $10.") // Example minimum withdrawal
  ),
  walletAddress: z.string().min(10, "Wallet address is too short.").max(100, "Wallet address is too long.").optional(), // Optional for now, make required based on method
  // Add other fields like bank details if bank transfer is an option
}).refine(data => {
    if (cryptoWithdrawalOptions.some(opt => opt.value === data.method)) {
        return !!data.walletAddress;
    }
    return true;
}, {
    message: "Wallet address is required for cryptocurrency withdrawals.",
    path: ["walletAddress"],
});


type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;

export default function WithdrawalPage() {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState(cryptoWithdrawalOptions[0].value);

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      method: cryptoWithdrawalOptions[0].value,
      amountUSD: 0,
      walletAddress: '',
    },
  });

  const { watch, control, handleSubmit, formState: { errors } } = form;
  
  const watchedMethod = watch('method');

  const onSubmit = (data: WithdrawalFormValues) => {
    // Simulate withdrawal submission
    console.log("Withdrawal request submitted:", data);
    toast({
      title: "Withdrawal Request Submitted",
      description: `Your withdrawal of $${data.amountUSD.toFixed(2)} via ${data.method} is being processed.`,
    });
    // Reset form or navigate
    form.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <ArrowUpCircle className="mr-3 h-8 w-8" /> Withdraw Funds
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Request Withdrawal</CardTitle>
            <CardDescription>Select your preferred method and amount to withdraw.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <AlertTitle>Processing Times & Fees</AlertTitle>
                <AlertDescription>
                  Withdrawals may take up to 24-48 hours to process. Network fees may apply for cryptocurrency withdrawals. Minimum withdrawal is $10.
                </AlertDescription>
              </Alert>

              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-base">Withdrawal Method</Label>
                    <Select onValueChange={(value) => { field.onChange(value); setSelectedMethod(value); }} defaultValue={field.value}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select a withdrawal method" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoWithdrawalOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-base py-2">
                            <div className="flex items-center gap-3">
                              {opt.icon}
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                        {/* Add other methods like Bank Transfer here */}
                         <SelectItem value="bank_transfer" className="text-base py-2" disabled>
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5" />
                              Bank Transfer (Coming Soon)
                            </div>
                          </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.method && <p className="text-sm font-medium text-destructive">{errors.method.message}</p>}
                  </FormItem>
                )}
              />

              <FormItem>
                <Label htmlFor="amountUSD" className="text-base">Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="amountUSD"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100"
                    className="pl-10 h-12 text-base"
                    {...form.register("amountUSD")}
                  />
                </div>
                {errors.amountUSD && <p className="text-sm font-medium text-destructive">{errors.amountUSD.message}</p>}
              </FormItem>
              
              {cryptoWithdrawalOptions.some(opt => opt.value === watchedMethod) && (
                <FormItem>
                    <Label htmlFor="walletAddress" className="text-base">
                        Your {cryptoWithdrawalOptions.find(c => c.value === watchedMethod)?.label} Wallet Address
                    </Label>
                    <Input
                        id="walletAddress"
                        type="text"
                        placeholder={`Enter your ${watchedMethod} wallet address`}
                        className="h-12 text-base"
                        {...form.register("walletAddress")}
                    />
                    {errors.walletAddress && <p className="text-sm font-medium text-destructive">{errors.walletAddress.message}</p>}
                </FormItem>
              )}

            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full sm:w-auto" variant="destructive">
                Request Withdrawal
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="md:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Security Check</AlertTitle>
              <AlertDescription>
                For security reasons, large withdrawals or withdrawals to new addresses may require additional verification.
              </AlertDescription>
            </Alert>
            <Alert>
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Correct Address</AlertTitle>
              <AlertDescription>
                Ensure your wallet address is correct. Sending funds to an incorrect address may result in permanent loss.
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
