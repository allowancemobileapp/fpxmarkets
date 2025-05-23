import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, ShieldCheck, Wallet, LineChart, CheckCircle, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: 'Quick Start Guide - FPX Markets',
  description: 'Get started quickly with FPX Markets. Your guide to opening an account and beginning your trading journey.',
};

const steps = [
  {
    icon: UserPlus,
    title: "1. Create Your Account",
    description: "Fill out our simple registration form to create your secure FPX Markets account. Choose an account type that suits your trading needs.",
    link: "/signup",
    linkLabel: "Register Now"
  },
  {
    icon: ShieldCheck,
    title: "2. Secure Your Account",
    description: "After registration, you'll be prompted to set up a 4-digit Trading PIN. This adds an extra layer of security for your trades and account actions.",
    linkLabel: "Learn about Security"
  },
  {
    icon: Wallet,
    title: "3. Fund Your Account",
    description: "Make your first deposit using our secure payment methods, including various cryptocurrencies. Remember the minimum deposit for your chosen account type.",
    link: "/dashboard/deposit", // This link assumes user is logged in, otherwise signup flow handles it.
    linkLabel: "Deposit Funds"
  },
  {
    icon: LineChart,
    title: "4. Explore the Markets",
    description: "Discover a wide range of trading instruments, including Forex, Shares, Commodities, and Digital Currencies. Use our tools to analyze market trends.",
    link: "/markets",
    linkLabel: "View Markets"
  },
   {
    icon: Briefcase,
    title: "5. Understand Your Platform",
    description: "Familiarize yourself with our powerful trading platform. Check out our WebTrader, mobile apps, and learn about placing orders and managing your portfolio.",
    link: "/trading-platforms",
    linkLabel: "Our Platforms"
  },
  {
    icon: CheckCircle,
    title: "6. Start Trading!",
    description: "Once your account is funded and you're comfortable with the platform, you can start placing trades and building your investment portfolio.",
    link: "/dashboard", // Link to dashboard home
    linkLabel: "Go to Dashboard"
  }
];

export default function QuickStartPage() {
  return (
    <GenericPageLayout
      title="Quick Start Guide"
      description="Your first steps to trading with FPX Markets. We'll guide you through account setup, funding, and platform basics to get you trading confidently."
    >
      <div className="space-y-10">
        {steps.map((step, index) => (
          <Card key={index} className="shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary/30 p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground p-3 rounded-full">
                  <step.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl text-primary">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
              {step.link && (
                <Button variant="link" asChild className="p-0 h-auto text-accent font-semibold">
                  <Link href={step.link}>{step.linkLabel}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        <div className="text-center mt-12">
          <p className="text-lg text-foreground mb-4">Ready to begin?</p>
          <Button asChild size="lg" variant="accent">
            <Link href="/signup">Open Your Account</Link>
          </Button>
          <p className="mt-4 text-muted-foreground">
            If you have any questions, don't hesitate to <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>.
          </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}
