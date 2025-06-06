
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scale, ShieldCheck, TrendingUp, Zap, SlidersHorizontal, Briefcase, Users } from "lucide-react";

export const metadata: Metadata = {
  title: 'Trading Information - FPX Markets',
  description: 'Learn about trading conditions, order types, leverage, and risk management at FPX Markets.',
};

const tradingInfoSections = [
  {
    icon: Briefcase,
    title: "Tradable Instruments",
    content: "FPX Markets offers a diverse range of instruments across global markets. Trade Forex currency pairs (Majors, Minors, Exotics), CFDs on Shares of leading global companies, major Stock Indices, popular Commodities like Gold and Oil, and a selection of Digital Currencies.",
    imageSrc: "https://picsum.photos/seed/tradeInstruments/600/400",
    imageHint: "financial instruments diverse",
  },
  {
    icon: SlidersHorizontal,
    title: "Order Types & Execution",
    content: "Utilize a variety of order types to manage your trading strategies, including Market Orders, Limit Orders, Stop Orders, and Trailing Stops. We are committed to providing fast and reliable execution with transparent pricing.",
    imageSrc: "https://picsum.photos/seed/tradeOrders/600/401",
    imageHint: "trade execution speed",
  },
  {
    icon: Scale,
    title: "Leverage & Margin",
    content: "Access flexible leverage options tailored to your account type and trading experience. Understand margin requirements and how leverage can amplify both potential profits and losses. Always trade responsibly.",
    imageSrc: "https://picsum.photos/seed/tradeLeverage/600/402",
    imageHint: "leverage balance scale",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    content: "We provide essential risk management tools such as Stop Loss and Take Profit orders to help you manage your exposure. Educational resources are also available to help you understand and mitigate trading risks.",
    imageSrc: "https://picsum.photos/seed/tradeRisk/600/403",
    imageHint: "security risk shield",
  },
  {
    icon: Zap,
    title: "Trading Conditions",
    content: "Experience competitive spreads, low latency execution, and transparent trading conditions. We aim to provide a fair and efficient trading environment for all our clients, with no hidden fees.",
    imageSrc: "https://picsum.photos/seed/tradeConditions/600/404",
    imageHint: "trading speed conditions",
  },
  {
    icon: Users,
    title: "Account Types",
    content: "Choose from a range of account types designed to suit different trading needs, from Beginner to Professional and Corporate. Each account offers specific benefits and minimum deposit requirements.",
    link: "/pricing", // Or directly to a trading plans section if more detailed
    linkLabel: "Compare Account Types",
    imageSrc: "https://picsum.photos/seed/tradeAccounts/600/405",
    imageHint: "user accounts comparison",
  }
];

export default function TradingPage() {
  return (
    <GenericPageLayout
      title="Trading with FPX Markets"
      description="Comprehensive information on our trading conditions, available instruments, order execution, risk management tools, and account types to empower your trading decisions."
    >
      <div className="space-y-12">
        {tradingInfoSections.map((section, index) => (
          <Card key={section.title} className={`shadow-lg overflow-hidden ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}`}>
            <div className="grid md:grid-cols-2 items-center">
              <div className={`p-6 sm:p-8 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="flex items-center mb-4">
                  <section.icon className="h-8 w-8 text-accent mr-3" />
                  <h3 className="text-2xl font-semibold text-primary">{section.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">{section.content}</p>
                {section.link && section.linkLabel && (
                  <Button asChild variant="link" className="text-accent font-semibold px-0">
                    <Link href={section.link}>{section.linkLabel}</Link>
                  </Button>
                )}
              </div>
              <div className={`relative h-64 md:h-80 w-full ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                <Image
                  src={section.imageSrc}
                  alt={section.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={section.imageHint}
                  className="opacity-90"
                />
              </div>
            </div>
          </Card>
        ))}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-primary mb-4">Ready to Start Trading?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Open an account with FPX Markets today and gain access to global financial markets with our advanced platforms and competitive conditions.
          </p>
          <Button asChild size="lg" variant="accent">
            <Link href="/signup">Open Live Account</Link>
          </Button>
        </div>
      </div>
    </GenericPageLayout>
  );
}
