
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Bitcoin, Briefcase, HelpCircle, QrCode, Copy } from 'lucide-react'; 
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getTradingPlan, type TradingPlan } from '@/config/tradingPlans';
import type { AccountType } from '@/lib/types';

const cryptocurrencies = [
  { value: 'BTC', label: 'Bitcoin', icon: <Bitcoin className="h-5 w-5" />, address: 'bc1q...', qr: 'https://placehold.co/150x150.png?text=BTC+QR', dataAiHint: "QR code Bitcoin" },
  { value: 'ETH', label: 'Ethereum', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 417" preserveAspectRatio="xMidYMid"><path fill="#343434" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.638V157.885z"/><path fill="#3C3C3B" d="m127.961 312.187l-1.575 1.92v98.199l1.575 4.6l127.963-177.959z"/><path fill="#8C8C8C" d="m127.962 416.905v-104.72L0 239.625z"/><path fill="#141414" d="m127.961 287.958l127.96-75.637l-127.96-58.162z"/><path fill="#393939" d="m.001 212.321l127.96 75.637V154.159z"/></svg>, address: '0x123...', qr: 'https://placehold.co/150x150.png?text=ETH+QR', dataAiHint: "QR code Ethereum" },
  { value: 'USDT', label: 'USDT (TRC20)', icon: <DollarSign className="h-5 w-5" />, address: 'TXYZ...', qr: 'https://placehold.co/150x150.png?text=USDT+QR', dataAiHint: "QR code USDT" },
  { value: 'SOL', label: 'Solana', icon: <Briefcase className="h-5 w-5" />, address: 'Sol1A...', qr: 'https://placehold.co/150x150.png?text=SOL+QR', dataAiHint: "QR code Solana"  },
];

const depositFormSchemaBase = z.object({
  crypto: z.string().min(1, "Please select a cryptocurrency."),
  amountUSD: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().min(1, "Amount must be at least $1.")
  ),
});

type DepositFormValues = z.infer<typeof depositFormSchemaBase>;

export default function DepositPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[0]);
  const [isFirstDeposit, setIsFirstDeposit] = useState(true); // Mock this state
  const [currentUserPlan, setCurrentUserPlan] = useState<TradingPlan | undefined>(undefined);

  useEffect(() => {
    if (user?.accountType) {
      setCurrentUserPlan(getTradingPlan(user.accountType as AccountType));
    }
  }, [user]);

  const minimumDepositAmount = currentUserPlan?.minimumDeposit || 500; // Default to 500 if plan not found

  const depositFormSchema = depositFormSchemaBase.refine(
    (data) => !isFirstDeposit || data.amountUSD >= minimumDepositAmount,
    {
      message: `Minimum first deposit for your ${currentUserPlan?.label || 'Beginner'} plan is $${minimumDepositAmount.toLocaleString()}.`,
      path: ["amountUSD"],
    }
  );

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      crypto: cryptocurrencies[0].value,
      amountUSD: 0,
    },
  });

  const { watch, control, handleSubmit, formState: { errors }, register } = form;
  const watchedAmountUSD = watch('amountUSD');

  useEffect(() => {
    const sub = watch((value) => {
      const found = cryptocurrencies.find(c => c.value === value.crypto);
      if (found) setSelectedCrypto(found);
    });
    return () => sub.unsubscribe();
  }, [watch]);


  const onSubmit = (data: DepositFormValues) => {
    // Validation is now handled by Zod refinement
    console.log("Deposit submitted:", data);
    toast({
      title: "Deposit Initiated",
      description: `Your ${data.crypto} deposit of $${data.amountUSD.toFixed(2)} is pending.`,
    });
    // Potentially set isFirstDeposit to false here after successful first deposit
    // form.reset(); // Or navigate
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedCrypto.address);
    toast({ title: "Address Copied!", description: `${selectedCrypto.address} copied to clipboard.` });
  };

  const cryptoAmount = watchedAmountUSD && watchedAmountUSD > 0 ? (watchedAmountUSD / (selectedCrypto.value === 'BTC' ? 68000 : selectedCrypto.value === 'ETH' ? 3800 : selectedCrypto.value === 'SOL' ? 150 : 1)).toFixed(6) : '0.000000';

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <DollarSign className="mr-3 h-8 w-8" /> Deposit Funds
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Create New Deposit</CardTitle>
            <CardDescription>Select a cryptocurrency and amount to deposit.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {isFirstDeposit && currentUserPlan && (
                <Alert variant="default" className="bg-accent/10 border-accent text-accent-foreground">
                  <HelpCircle className="h-5 w-5 text-accent" />
                  <AlertTitle>{currentUserPlan.label} Plan - First Deposit!</AlertTitle>
                  <AlertDescription>
                    A minimum deposit of ${minimumDepositAmount.toLocaleString()} is required for your first transaction with the {currentUserPlan.label} plan to unlock potential bonuses.
                  </AlertDescription>
                </Alert>
              )}

              <Controller
                name="crypto"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-base">Select Cryptocurrency</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select a cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptocurrencies.map(crypto => (
                          <SelectItem key={crypto.value} value={crypto.value} className="text-base py-2">
                            <div className="flex items-center gap-3">
                              {crypto.icon}
                              {crypto.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.crypto && <p className="text-sm font-medium text-destructive">{errors.crypto.message}</p>}
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
                    placeholder={`e.g., ${minimumDepositAmount}`}
                    className="pl-10 h-12 text-base"
                    {...register("amountUSD")}
                  />
                </div>
                {errors.amountUSD && <p className="text-sm font-medium text-destructive">{errors.amountUSD.message}</p>}
              </FormItem>
              
              <div className="text-sm text-muted-foreground">
                You will receive approximately: <span className="font-semibold text-foreground">{cryptoAmount} {selectedCrypto.value}</span>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Confirm Deposit Details
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="md:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                {selectedCrypto.icon} {selectedCrypto.label} Deposit Address
            </CardTitle>
            <CardDescription>Send {selectedCrypto.value} to the address below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="bg-muted p-4 rounded-md flex justify-center">
                <Image src={selectedCrypto.qr} alt={`${selectedCrypto.label} QR Code`} width={150} height={150} data-ai-hint={selectedCrypto.dataAiHint} />
            </div>
            <p className="text-sm font-mono break-all bg-muted/50 p-3 rounded-md">
                {selectedCrypto.address}
            </p>
            <Button variant="outline" className="w-full" onClick={handleCopyAddress}>
              <Copy className="mr-2 h-4 w-4" /> Copy Address
            </Button>
             <Alert variant="destructive" className="text-left">
              <QrCode className="h-5 w-5" />
              <AlertTitle>Important!</AlertTitle>
              <AlertDescription>
                Only send {selectedCrypto.value} to this address. Sending any other coins may result in permanent loss.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { FormItem } from '@/components/ui/form';
