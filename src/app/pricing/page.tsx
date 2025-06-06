
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Layers, Shield, Info, Percent, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Pricing & Spreads - FPX Markets',
  description: 'Transparent pricing, competitive spreads, and trading costs at FPX Markets. Understand our fee structure.',
};

const accountTiers = [
  { name: "Beginner", minDeposit: "$500", typicalSpreadEURUSD: "1.6 pips", commission: "Zero", leverage: "Up to 1:500" },
  { name: "Personal", minDeposit: "$2,500", typicalSpreadEURUSD: "1.2 pips", commission: "Zero", leverage: "Up to 1:500" },
  { name: "Pro", minDeposit: "$10,000", typicalSpreadEURUSD: "0.8 pips", commission: "Zero", leverage: "Up to 1:400" },
  { name: "Professional", minDeposit: "$50,000", typicalSpreadEURUSD: "0.2 pips", commission: "$3.5 per lot", leverage: "Up to 1:200" },
  { name: "Corporate", minDeposit: "$100,000+", typicalSpreadEURUSD: "Custom", commission: "Custom", leverage: "Custom" },
];

const feeInfo = [
    { icon: DollarSign, title: "No Deposit Fees", description: "We do not charge any fees for depositing funds into your trading account." },
    { icon: Percent, title: "Competitive Spreads", description: "Benefit from tight spreads across all our financial instruments, starting from as low as 0.2 pips." },
    { icon: Zap, title: "Low to Zero Commissions", description: "Most account types enjoy commission-free trading. Professional accounts have low, transparent commissions." },
    { icon: Info, title: "Transparent Rollover Rates", description: "Overnight financing (swap) rates are clearly displayed within our trading platforms." },
];

export default function PricingPage() {
  return (
    <GenericPageLayout
      title="Transparent & Competitive Pricing"
      description="Discover our straightforward pricing model. We offer tight spreads, low commissions, and no hidden fees across all asset classes to enhance your trading profitability."
    >
      <div className="space-y-12">
        {/* Account Tiers Comparison Table */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-6 text-center">Account Types & Spreads</h2>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] sm:w-[200px]">Account Type</TableHead>
                    <TableHead>Min. Deposit</TableHead>
                    <TableHead>Typical Spread (EUR/USD)</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead className="hidden sm:table-cell">Max. Leverage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountTiers.map((tier) => (
                    <TableRow key={tier.name} className={tier.name === 'Pro' ? 'bg-accent/10' : ''}>
                      <TableCell className={`font-medium ${tier.name === 'Pro' ? 'text-accent-foreground' : 'text-foreground'}`}>{tier.name}</TableCell>
                      <TableCell>{tier.minDeposit}</TableCell>
                      <TableCell>{tier.typicalSpreadEURUSD}</TableCell>
                      <TableCell>{tier.commission}</TableCell>
                      <TableCell className="hidden sm:table-cell">{tier.leverage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="p-4 text-xs text-muted-foreground bg-muted/30">
              <Info className="h-4 w-4 mr-2 flex-shrink-0"/> Spreads are variable and subject to market conditions. Leverage depends on the financial instrument and client's country of residence.
            </CardFooter>
          </Card>
        </section>

        {/* Other Fees & Conditions */}
        <section className="py-12 bg-secondary/30 rounded-lg">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-10 text-center">Fee Structure Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {feeInfo.map((item) => (
                    <Card key={item.title} className="text-center shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                    <CardHeader>
                        <item.icon className="h-10 w-10 text-accent mx-auto mb-3" />
                        <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        </section>
        
        {/* General Information Section */}
        <section>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary">No Hidden Charges</h3>
                    <p className="text-muted-foreground">At FPX Markets, we believe in full transparency. All potential costs associated with trading are clearly outlined. We strive to keep our fees competitive to ensure you get the most out of your investments.</p>
                    <h3 className="text-xl font-semibold text-primary mt-4">Withdrawal Information</h3>
                    <p className="text-muted-foreground">Withdrawal requests are processed promptly. While FPX Markets does not charge fees for most withdrawal methods, intermediary banks or payment processors might apply their own charges.</p>
                </div>
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt="Transparent financial operations"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="financial security transparency"
                        className="opacity-90"
                    />
                </div>
            </div>
        </section>

        <div className="text-center mt-12">
          <p className="text-lg text-foreground mb-4">Understand our costs and start trading with confidence.</p>
          <Button asChild size="lg" variant="accent">
            <Link href="/signup">Open an Account</Link>
          </Button>
           <p className="mt-4 text-sm text-muted-foreground">
            Have more questions? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link>.
          </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}
