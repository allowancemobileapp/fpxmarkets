
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scale, ShieldCheck, TrendingUp, Zap, SlidersHorizontal, Briefcase, Users } from "lucide-react";
import { getImagesByContextTags, type ImageData } from "@/lib/imageService";

export const metadata: Metadata = {
  title: 'Trading Information - FPX Markets',
  description: 'Learn about trading conditions, order types, leverage, and risk management at FPX Markets.',
};

interface TradingInfoSection {
  icon: React.ElementType;
  title: string;
  content: string;
  contextTag: string; // For fetching image from DB
  link?: string;
  linkLabel?: string;
}

const tradingInfoSectionsData: TradingInfoSection[] = [
  {
    icon: Briefcase,
    title: "Tradable Instruments",
    content: "FPX Markets offers a diverse range of instruments across global markets. Trade Forex currency pairs (Majors, Minors, Exotics), CFDs on Shares of leading global companies, major Stock Indices, popular Commodities like Gold and Oil, and a selection of Digital Currencies.",
    contextTag: "trade_instruments_promo",
  },
  {
    icon: SlidersHorizontal,
    title: "Order Types & Execution",
    content: "Utilize a variety of order types to manage your trading strategies, including Market Orders, Limit Orders, Stop Orders, and Trailing Stops. We are committed to providing fast and reliable execution with transparent pricing.",
    contextTag: "trade_orders_promo",
  },
  {
    icon: Scale,
    title: "Leverage & Margin",
    content: "Access flexible leverage options tailored to your account type and trading experience. Understand margin requirements and how leverage can amplify both potential profits and losses. Always trade responsibly.",
    contextTag: "trade_leverage_promo",
  },
  {
    icon: ShieldCheck,
    title: "Risk Management",
    content: "We provide essential risk management tools such as Stop Loss and Take Profit orders to help you manage your exposure. Educational resources are also available to help you understand and mitigate trading risks.",
    contextTag: "trade_risk_promo",
  },
  {
    icon: Zap,
    title: "Trading Conditions",
    content: "Experience competitive spreads, low latency execution, and transparent trading conditions. We aim to provide a fair and efficient trading environment for all our clients, with no hidden fees.",
    contextTag: "trade_conditions_promo",
  },
  {
    icon: Users,
    title: "Account Types",
    content: "Choose from a range of account types designed to suit different trading needs, from Beginner to Professional and Corporate. Each account offers specific benefits and minimum deposit requirements.",
    link: "/pricing",
    linkLabel: "Compare Account Types",
    contextTag: "trade_accounts_promo",
  }
];

const DEFAULT_PLACEHOLDER_IMAGE_URL = 'https://placehold.co/600x400.png';

export default async function TradingPage() {
  const contextTagsToFetch = tradingInfoSectionsData.map(section => section.contextTag);
  console.log('[TradingPage] SERVER: Requesting images for contextTags:', JSON.stringify(contextTagsToFetch));
  
  let imagesDataMap: Record<string, ImageData> = {};
  try {
    imagesDataMap = await getImagesByContextTags(contextTagsToFetch);
    console.log('[TradingPage] SERVER: Received imagesDataMap from imageService:', JSON.stringify(imagesDataMap, null, 2));
  } catch (error) {
    console.error('[TradingPage] SERVER: Error fetching images from imageService:', error);
    // Initialize with defaults for all sections if fetching fails
    tradingInfoSectionsData.forEach(section => {
        imagesDataMap[section.contextTag] = { imageUrl: DEFAULT_PLACEHOLDER_IMAGE_URL, altText: `${section.title} placeholder (service error)` };
    });
  }

  return (
    <GenericPageLayout
      title="Trading with FPX Markets"
      description="Comprehensive information on our trading conditions, available instruments, order execution, risk management tools, and account types to empower your trading decisions."
    >
      <div className="space-y-12">
        {tradingInfoSectionsData.map((section, index) => {
          const imageData = imagesDataMap[section.contextTag] || { imageUrl: DEFAULT_PLACEHOLDER_IMAGE_URL, altText: `${section.title} (fallback)` };
          const imageUrl = imageData.imageUrl;
          const altText = imageData.altText;

          console.log(`[TradingPage] SERVER: For section "${section.title}" (context: ${section.contextTag}) - Using Image URL: "${imageUrl}", Alt: "${altText}"`);

          return (
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
                    src={imageUrl}
                    alt={altText}
                    layout="fill"
                    objectFit="cover"
                    className="opacity-90 bg-muted" // Added bg-muted for loading state
                    priority={index < 2} // Prioritize loading first few images
                  />
                </div>
              </div>
            </Card>
          );
        })}
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
