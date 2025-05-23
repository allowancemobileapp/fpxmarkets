
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import { tradingPlans, type TradingPlan } from "@/config/tradingPlans";

export default function TradingPlansSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Choose Your Trading Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a plan that matches your trading style and goals. Each plan comes with a different minimum deposit to get started.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {tradingPlans.map((plan, index) => (
            <Card 
              key={plan.value} 
              className={`flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden ${
                plan.value === 'Pro' ? 'border-2 border-accent ring-2 ring-accent/50' : ''
              }`}
            >
              {plan.value === 'Pro' && (
                <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader className="p-6 text-center">
                <Zap className={`h-12 w-12 mx-auto mb-4 ${plan.value === 'Pro' ? 'text-accent' : 'text-primary'}`} />
                <CardTitle className={`text-2xl font-semibold ${plan.value === 'Pro' ? 'text-accent' : 'text-primary'}`}>
                  {plan.label}
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground h-12">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.minimumDeposit.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground"> min. deposit</span>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  {[
                    "Access to all trading instruments",
                    plan.minimumDeposit >= 10000 ? "Advanced charting tools" : "Standard charting tools",
                    plan.minimumDeposit >= 2500 ? "Priority email support" : "Email support",
                    plan.minimumDeposit >= 50000 ? "Dedicated account manager" : (plan.minimumDeposit >=10000 ? "Enhanced market insights" : "Basic market insights"),
                  ].map(feature => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-positive mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 bg-muted/30 mt-auto">
                <Button 
                  asChild 
                  className="w-full text-lg py-3"
                  variant={plan.value === 'Pro' ? 'accent' : 'default'}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
