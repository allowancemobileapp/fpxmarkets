'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MarketInsightsFormSchema, type MarketInsightsFormValues } from '@/lib/types';
import { getAIMarketInsights } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function MarketInsights() {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MarketInsightsFormValues>({
    resolver: zodResolver(MarketInsightsFormSchema),
    defaultValues: {
      interests: '',
    },
  });

  async function onSubmit(values: MarketInsightsFormValues) {
    setIsLoading(true);
    setInsights(null);
    setError(null);
    
    const result = await getAIMarketInsights({ interests: values.interests });

    if ('error' in result) {
      setError(result.error);
    } else {
      setInsights(result.insights);
    }
    setIsLoading(false);
  }

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center bg-accent/10 p-3 rounded-full mx-auto mb-4">
               <Lightbulb className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">AI-Powered Market Insights</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Enter your interests (e.g., Forex, Tech Stocks, Gold) to get personalized market insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="interests-input" className="text-lg">Your Interests</FormLabel>
                      <FormControl>
                        <Input id="interests-input" placeholder="e.g., Forex, Renewable Energy, ETFs" {...field} className="text-base py-3 px-4"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Insights...
                    </>
                  ) : (
                    'Get Insights'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          {(insights || error) && (
            <CardFooter className="flex flex-col items-start pt-6">
              {error && (
                <Alert variant="destructive" className="w-full">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {insights && (
                <div className="w-full p-6 bg-primary/5 rounded-md border border-primary/20">
                  <h3 className="text-xl font-semibold text-primary mb-3">Generated Insights:</h3>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">{insights}</p>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </section>
  );
}
