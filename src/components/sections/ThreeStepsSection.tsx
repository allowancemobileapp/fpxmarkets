'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Wallet, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

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
    link: "/dashboard/deposit" // Or link to signup if not logged in, then redirect
  },
  {
    icon: TrendingUp,
    title: "Start Trading",
    description: "Explore global markets, utilize advanced tools, and begin your trading journey.",
    link: "/dashboard/markets" // Or link to signup if not logged in
  },
];

export default function ThreeStepsSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Get Started in Three Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Joining FPX Markets and starting your trading journey is straightforward and fast.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl h-full flex flex-col">
                <CardHeader className="pb-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="link" asChild className="text-primary hover:text-accent">
                    <Link href={step.link}>
                      {index === 0 ? "Register Now" : index === 1 ? "Fund Account" : "Explore Markets"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-10 w-10 text-muted-foreground/50 transform rotate-0 md:rotate-0" />
                </div>
              )}
               {index < steps.length - 1 && (
                 <div className="flex md:hidden items-center justify-center my-4">
                  <ArrowRight className="h-10 w-10 text-muted-foreground/50 transform rotate-90 md:rotate-0" />
                </div>
               )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react'; // Required for React.Fragment
