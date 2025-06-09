
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Landmark, TrendingUp, Bitcoin, Briefcase, BarChart3, Percent, Globe, CheckCircle } from "lucide-react";
import { getImagesByContextTags, type ImageData } from "@/lib/imageService"; // Import the service

export const metadata: Metadata = {
  title: 'Markets Overview - FPX Markets',
  description: 'Explore the wide range of global markets available for trading at FPX Markets, including Forex, Shares, Indices, and Commodities.',
};

interface MarketCategoryDefinition {
  icon: React.ElementType;
  title: string;
  description: string;
  examples: string[];
  contextTag: string;
}

const marketCategoryDefinitions: MarketCategoryDefinition[] = [
  {
    icon: Landmark,
    title: "Forex (Foreign Exchange)",
    description: "Trade the world's largest financial market. Access major, minor, and exotic currency pairs with competitive spreads and 24/5 availability.",
    examples: ["EUR/USD", "GBP/JPY", "AUD/CAD"],
    contextTag: 'markets_page_forex'
  },
  {
    icon: TrendingUp,
    title: "Shares CFDs",
    description: "Speculate on the price movements of leading global companies from various sectors like tech, finance, and healthcare. Trade CFDs without owning the underlying asset.",
    examples: ["Apple (AAPL)", "Tesla (TSLA)", "Amazon (AMZN)"],
    contextTag: 'markets_page_shares_cfds'
  },
  {
    icon: Briefcase,
    title: "Commodities",
    description: "Diversify your portfolio by trading CFDs on hard and soft commodities, including precious metals like Gold and Silver, energies like Crude Oil, and agricultural products.",
    examples: ["Gold (XAU/USD)", "Crude Oil (WTI)", "Natural Gas"],
    contextTag: 'markets_page_commodities'
  },
  {
    icon: BarChart3,
    title: "Indices CFDs",
    description: "Gain exposure to entire stock market sectors by trading CFDs on major global indices. Speculate on the overall performance of economies like the US, UK, Germany, and Japan.",
    examples: ["S&P 500", "NASDAQ 100", "FTSE 100"],
    contextTag: 'markets_page_indices'
  },
  {
    icon: Bitcoin,
    title: "Digital Currencies (Cryptocurrencies)",
    description: "Explore the dynamic world of digital currencies. Trade CFDs on popular cryptocurrencies like Bitcoin, Ethereum, and others against major fiat currencies.",
    examples: ["BTC/USD", "ETH/USD", "LTC/USD"],
    contextTag: 'markets_page_digital_currencies'
  }
];

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';


export default async function MarketsPage() {
  const contextTags = marketCategoryDefinitions.map(mc => mc.contextTag);
  const imagesDataMap = await getImagesByContextTags(contextTags);

  return (
    <GenericPageLayout
      title="Global Markets at Your Fingertips"
      description="Access a diverse range of financial markets. Trade Forex, Shares, Indices, Commodities, and Digital Currencies with competitive conditions at FPX Markets."
    >
      <div className="space-y-10">
        {marketCategoryDefinitions.map((market, index) => {
          const imageData = imagesDataMap[market.contextTag];
          const imageUrl = imageData?.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;
          const altText = imageData?.altText || market.title; // Fallback alt text

          return (
            <Card key={market.title} className="shadow-xl overflow-hidden">
              <div className={`grid md:grid-cols-5 items-center gap-0 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <div className={`md:col-span-2 relative h-64 md:h-full w-full ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <Image
                    src={imageUrl}
                    alt={altText}
                    layout="fill"
                    objectFit="cover"
                    // data-ai-hint can be removed
                  />
                </div>
                <div className="md:col-span-3 p-6 sm:p-8">
                  <div className="flex items-center mb-3">
                    <market.icon className="h-10 w-10 text-accent mr-4 flex-shrink-0" />
                    <CardTitle className="text-2xl text-primary">{market.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed mb-4">
                    {market.description}
                  </CardDescription>
                  <h4 className="font-semibold text-foreground mb-2">Popular Examples:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-6">
                    {market.examples.map(example => <li key={example}>{example}</li>)}
                  </ul>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/markets">Explore {market.title}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="text-center mt-16 py-8 bg-secondary/30 rounded-lg">
        <h3 className="text-2xl font-semibold text-primary mb-3">Why Trade with FPX Markets?</h3>
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-left px-4">
            <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                <p className="text-muted-foreground"><strong className="text-foreground">Competitive Spreads:</strong> Maximize your trading potential with our tight spreads.</p>
            </div>
            <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                <p className="text-muted-foreground"><strong className="text-foreground">Advanced Platforms:</strong> Trade on robust and intuitive platforms across all devices.</p>
            </div>
            <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                <p className="text-muted-foreground"><strong className="text-foreground">Secure Environment:</strong> Your funds and data are protected with top-tier security.</p>
            </div>
             <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                <p className="text-muted-foreground"><strong className="text-foreground">Dedicated Support:</strong> Our expert team is here to assist you 24/5.</p>
            </div>
        </div>
        <Button asChild size="lg" variant="accent" className="mt-8">
          <Link href="/signup">Open Account & Start Trading</Link>
        </Button>
      </div>
    </GenericPageLayout>
  );
}
