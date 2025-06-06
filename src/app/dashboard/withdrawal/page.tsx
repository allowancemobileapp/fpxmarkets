
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpCircle, DollarSign, AlertTriangle, Landmark, Bitcoin } from 'lucide-react'; // Added Bitcoin icon
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FormItem } from '@/components/ui/form'; 
import { countries } from '@/config/countries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import { BankWithdrawalFormSchema, type BankWithdrawalFormValues, BTCWithdrawalFormSchema, type BTCWithdrawalFormValues } from '@/lib/types'; // Import new schema

const MOCK_BTC_PRICE_USD = 68000; // Example static BTC price for conversion display

export default function WithdrawalPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bank");
  const [btcAmount, setBtcAmount] = useState('0.000000');
  
  const bankForm = useForm<BankWithdrawalFormValues>({
    resolver: zodResolver(BankWithdrawalFormSchema),
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

  const btcForm = useForm<BTCWithdrawalFormValues>({
    resolver: zodResolver(BTCWithdrawalFormSchema),
    defaultValues: {
      amountUSD: 0,
      btcAddress: '',
      notes: '',
    },
  });

  const { control: bankControl, handleSubmit: handleBankSubmit, formState: { errors: bankErrors }, register: bankRegister, reset: resetBankForm } = bankForm;
  const { control: btcControl, handleSubmit: handleBtcSubmit, formState: { errors: btcErrors }, register: btcRegister, watch: watchBtcAmountUSD, reset: resetBtcForm } = btcForm;
  
  const btcAmountUSD = watchBtcAmountUSD('amountUSD');

  useEffect(() => {
    if (btcAmountUSD && btcAmountUSD > 0) {
      setBtcAmount((btcAmountUSD / MOCK_BTC_PRICE_USD).toFixed(8));
    } else {
      setBtcAmount('0.000000');
    }
  }, [btcAmountUSD]);

  const onBankSubmit = (data: BankWithdrawalFormValues) => {
    console.log("Bank withdrawal request submitted:", data);
    toast({
      title: "Withdrawal Request Submitted (Bank)",
      description: `Your bank withdrawal of $${data.amountUSD.toFixed(2)} is being processed. This is a UI demonstration.`,
    });
    resetBankForm();
  };

  const onBtcSubmit = (data: BTCWithdrawalFormValues) => {
    console.log("BTC withdrawal request submitted:", data);
    const calculatedBtcAmount = (data.amountUSD / MOCK_BTC_PRICE_USD).toFixed(8);
    toast({
      title: "Withdrawal Request Submitted (BTC)",
      description: `Your BTC withdrawal of approx. ${calculatedBtcAmount} BTC (valued at $${data.amountUSD.toFixed(2)}) to ${data.btcAddress} is being processed. This is a UI demonstration.`,
      variant: "default" 
    });
    resetBtcForm();
    setBtcAmount('0.000000');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <ArrowUpCircle className="mr-3 h-8 w-8" /> Withdraw Funds
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto md:mx-0">
          <TabsTrigger value="bank" className="text-base py-2.5"><Landmark className="mr-2 h-5 w-5" />Bank Transfer</TabsTrigger>
          <TabsTrigger value="btc" className="text-base py-2.5"><Bitcoin className="mr-2 h-5 w-5" />BTC</TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Request Bank Withdrawal</CardTitle>
                <CardDescription>Enter your bank details and the amount you wish to withdraw.</CardDescription>
              </CardHeader>
              <form onSubmit={handleBankSubmit(onBankSubmit)}>
                <CardContent className="space-y-6">
                  <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                    <AlertTitle>Processing Times & Fees</AlertTitle>
                    <AlertDescription>
                      Bank withdrawals may take 3-5 business days. Fees may be applied by intermediary banks. Minimum withdrawal is $50.
                    </AlertDescription>
                  </Alert>

                  <FormItem>
                    <Label htmlFor="bankAmountUSD" className="text-base">Amount (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="bankAmountUSD"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 100"
                        className="pl-10 h-12 text-base"
                        {...bankRegister("amountUSD")}
                      />
                    </div>
                    {bankErrors.amountUSD && <p className="text-sm font-medium text-destructive">{bankErrors.amountUSD.message}</p>}
                  </FormItem>

                  <FormItem>
                    <Label htmlFor="accountHolderName" className="text-base">Account Holder Name *</Label>
                    <Input id="accountHolderName" placeholder="John Doe" className="h-12 text-base" {...bankRegister("accountHolderName")} />
                    {bankErrors.accountHolderName && <p className="text-sm font-medium text-destructive">{bankErrors.accountHolderName.message}</p>}
                  </FormItem>

                  <FormItem>
                    <Label htmlFor="bankName" className="text-base">Bank Name *</Label>
                    <Input id="bankName" placeholder="e.g., Global First Bank" className="h-12 text-base" {...bankRegister("bankName")} />
                    {bankErrors.bankName && <p className="text-sm font-medium text-destructive">{bankErrors.bankName.message}</p>}
                  </FormItem>
                  
                  <FormItem>
                    <Label htmlFor="accountNumber" className="text-base">Account Number *</Label>
                    <Input id="accountNumber" placeholder="e.g., 1234567890" className="h-12 text-base" {...bankRegister("accountNumber")} />
                    {bankErrors.accountNumber && <p className="text-sm font-medium text-destructive">{bankErrors.accountNumber.message}</p>}
                  </FormItem>
                  
                  <FormItem>
                    <Label htmlFor="swiftBic" className="text-base">SWIFT/BIC Code</Label>
                    <Input id="swiftBic" placeholder="e.g., BANKUS33 (Optional for some regions)" className="h-12 text-base" {...bankRegister("swiftBic")} />
                    {bankErrors.swiftBic && <p className="text-sm font-medium text-destructive">{bankErrors.swiftBic.message}</p>}
                  </FormItem>

                  <Controller
                    name="bankCountry"
                    control={bankControl}
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
                        {bankErrors.bankCountry && <p className="text-sm font-medium text-destructive">{bankErrors.bankCountry.message}</p>}
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <Label htmlFor="bankNotes" className="text-base">Notes (Optional)</Label>
                    <Input id="bankNotes" placeholder="Any specific instructions" className="h-12 text-base" {...bankRegister("notes")} />
                    {bankErrors.notes && <p className="text-sm font-medium text-destructive">{bankErrors.notes.message}</p>}
                  </FormItem>
                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" variant="destructive" disabled={bankForm.formState.isSubmitting}>
                    Request Bank Withdrawal
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="md:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Landmark className="mr-2 h-6 w-6 text-primary"/>Important Notes</CardTitle>
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
        </TabsContent>

        <TabsContent value="btc" className="mt-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Request BTC Withdrawal</CardTitle>
                <CardDescription>Enter your BTC wallet address and the amount (in USD) you wish to withdraw.</CardDescription>
              </CardHeader>
              <form onSubmit={handleBtcSubmit(onBtcSubmit)}>
                <CardContent className="space-y-6">
                  <Alert variant="default" className="bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
                    <Bitcoin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <AlertTitle>BTC Network & Fees</AlertTitle>
                    <AlertDescription>
                      BTC withdrawals are processed on the Bitcoin network. Network fees will apply and will be deducted from the withdrawal amount. Minimum withdrawal is $20 USD equivalent.
                    </AlertDescription>
                  </Alert>

                  <FormItem>
                    <Label htmlFor="btcAmountUSD" className="text-base">Amount (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="btcAmountUSD"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 100"
                        className="pl-10 h-12 text-base"
                        {...btcRegister("amountUSD")}
                      />
                    </div>
                    {btcErrors.amountUSD && <p className="text-sm font-medium text-destructive">{btcErrors.amountUSD.message}</p>}
                     <p className="text-xs text-muted-foreground mt-1">Approx. <span className="font-semibold text-foreground">{btcAmount}</span> BTC (at ~${MOCK_BTC_PRICE_USD.toLocaleString()}/BTC)</p>
                  </FormItem>

                  <FormItem>
                    <Label htmlFor="btcAddress" className="text-base">BTC Wallet Address *</Label>
                    <Input 
                      id="btcAddress" 
                      placeholder="Enter your BTC wallet address" 
                      className="h-12 text-base" 
                      {...btcRegister("btcAddress")} 
                    />
                    {btcErrors.btcAddress && <p className="text-sm font-medium text-destructive">{btcErrors.btcAddress.message}</p>}
                  </FormItem>
                  
                  <FormItem>
                    <Label htmlFor="btcNotes" className="text-base">Notes (Optional)</Label>
                    <Input id="btcNotes" placeholder="Any specific instructions" className="h-12 text-base" {...btcRegister("notes")} />
                    {btcErrors.notes && <p className="text-sm font-medium text-destructive">{btcErrors.notes.message}</p>}
                  </FormItem>

                </CardContent>
                <CardFooter>
                  <Button type="submit" size="lg" className="w-full sm:w-auto" variant="destructive" disabled={btcForm.formState.isSubmitting}>
                    Request BTC Withdrawal
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="md:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><Bitcoin className="mr-2 h-6 w-6 text-primary"/>Important Notes for BTC Withdrawal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Alert variant="destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Triple Check Address!</AlertTitle>
                  <AlertDescription>
                    BTC transactions are irreversible. Ensure your BTC wallet address is absolutely correct. Sending to an incorrect address will result in permanent loss of funds.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Network Confirmations</AlertTitle>
                  <AlertDescription>
                    Once broadcasted, BTC transactions require network confirmations. This may take some time depending on network congestion.
                  </AlertDescription>
                </Alert>
                 <p className="text-sm text-muted-foreground">
                    Current estimated BTC price: ~${MOCK_BTC_PRICE_USD.toLocaleString()}/BTC. This is for indicative purposes only.
                 </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

