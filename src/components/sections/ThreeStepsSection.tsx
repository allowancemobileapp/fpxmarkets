
'use client';

import React from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Wallet, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { cn } from "@/lib/utils"; // Import cn

const steps = [
  {
    icon: UserPlus,
    title: "Register Account",
    description: "Quickly sign up with your details to create your secure trading account.",
    link: "/signup"
  },
  {
    icon: Wallet,
    title: "Deposit Funds",
    description: "Fund your account easily using our secure deposit methods, including various cryptocurrencies.",
    link: "/dashboard/deposit" // Link to deposit page, assumes logged in for dashboard access
  },
  {
    icon: TrendingUp,
    title: "Start Trading",
    description: "Explore global markets, utilize advanced tools, and begin your trading journey.",
    link: "/dashboard/markets" // Link to markets page within dashboard
  },
];

export default function ThreeStepsSection() {
  return (
    <section className="py-12 sm:py-16 bg-background"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10"> 
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary"> 
            Get Started in Three Simple Steps
          </h2>
          <p className="mt-3 text-md text-muted-foreground max-w-xl mx-auto"> 
            Joining FPX Markets and starting your trading journey is straightforward and fast.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"> 
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <Card className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg h-full flex flex-col">
                <CardHeader className="pb-3 pt-5"> 
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3"> 
                    <step.icon className="h-6 w-6 text-primary" /> 
                  </div>
                  <CardTitle className="text-lg font-semibold text-primary">{step.title}</CardTitle> 
                </CardHeader>
                <CardContent className="flex-grow px-4 pb-4 pt-0"> 
                  <p className="text-sm text-muted-foreground">{step.description}</p> 
                </CardContent>
                <div className="p-4 pt-0">
                  <Link
                    href={step.link}
                    className={cn(
                      buttonVariants({ variant: "link", size: "sm" }),
                      "text-primary hover:text-accent text-sm"
                    )}
                  >
                    <span className="flex items-center">
                      {index === 0 ? "Register Now" : index === 1 ? "Fund Account" : "Explore Markets"}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-muted-foreground/40" /> 
                </div>
              )}
               {index < steps.length - 1 && (
                 <div className="flex md:hidden items-center justify-center my-3"> 
                  <ArrowRight className="h-8 w-8 text-muted-foreground/40 transform rotate-90" /> 
                </div>
               )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
