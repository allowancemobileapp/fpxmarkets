
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Copy, TrendingUp, CheckCircle, BarChartBig } from "lucide-react";
import { getImagesByContextTags, type ImageData } from "@/lib/imageService";

export const metadata: Metadata = {
  title: 'Copy Trading - FPX Markets',
  description: 'Discover the power of Copy Trading with FPX Markets. Replicate the strategies of successful traders automatically and enhance your portfolio.',
};

interface CopyTradingFeature {
  icon: React.ElementType;
  title: string;
  content: string;
  contextTag: string; // To fetch image from DB
  // imageSrc and imageHint are removed as we'll use DB images
}

const copyTradingFeaturesData: CopyTradingFeature[] = [
  {
    icon: Users,
    title: "Follow Experienced Traders",
    content: "Browse a curated list of successful traders, review their performance statistics, risk profiles, and trading styles before deciding to copy them.",
    contextTag: "copy_trader_profiles_promo",
  },
  {
    icon: Copy,
    title: "Automated Strategy Replication",
    content: "Once you choose a trader to copy, our platform automatically replicates their trades in your account in real-time, proportionally to your allocated funds.",
    contextTag: "copy_auto_trading_promo",
  },
  {
    icon: TrendingUp,
    title: "Diversify Your Portfolio",
    content: "Copy trading can be an excellent way to diversify your investment strategies by tapping into the expertise of multiple traders across different markets.",
    contextTag: "copy_portfolio_div_promo",
  },
  {
    icon: BarChartBig,
    title: "Transparent Performance",
    content: "Monitor the performance of your copied trades directly from your dashboard. Get detailed reports and insights into how your copied strategies are performing.",
    contextTag: "copy_analytics_promo",
  }
];

const DEFAULT_PLACEHOLDER_IMAGE_URL = 'https://placehold.co/600x400.png'; // Fallback, though imageService should provide one

export default async function CopyTradingPage() {
  const contextTagsToFetch = copyTradingFeaturesData.map(feature => feature.contextTag);
  console.log(`[CopyTradingPage] SERVER: Requesting images for contextTags: ${JSON.stringify(contextTagsToFetch)}`);
  
  let imagesDataMap: Record<string, ImageData> = {};
  try {
    imagesDataMap = await getImagesByContextTags(contextTagsToFetch);
    console.log(`[CopyTradingPage] SERVER: Received imagesDataMap from imageService:`, JSON.stringify(imagesDataMap, null, 2));
  } catch (error) {
    console.error(`[CopyTradingPage] SERVER: Error fetching imagesDataMap from imageService:`, error);
    // Initialize with defaults for all features if fetching fails
    copyTradingFeaturesData.forEach(feature => {
      imagesDataMap[feature.contextTag] = { imageUrl: DEFAULT_PLACEHOLDER_IMAGE_URL, altText: `${feature.title} placeholder (service error)` };
    });
  }

  return (
    <GenericPageLayout
      title="Unlock Copy Trading Potential"
      description="Leverage the expertise of seasoned traders by automatically copying their trading strategies. A smart way to diversify and potentially grow your investments with FPX Markets."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-8 text-center">How Copy Trading Works at FPX Markets</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {copyTradingFeaturesData.slice(0, 2).map((feature) => {
              const imageData = imagesDataMap[feature.contextTag]; // imageService provides default if not found
              console.log(`[CopyTradingPage] SERVER: For feature "${feature.title}" (context: ${feature.contextTag}) - Using Image URL: "${imageData.imageUrl}", Alt: "${imageData.altText}"`);
              return (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-56 w-full">
                    <Image
                      src={imageData.imageUrl}
                      alt={imageData.altText}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg bg-muted"
                      priority // Prioritize first two images
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <feature.icon className="h-8 w-8 text-accent mr-3" />
                      <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="py-12 bg-secondary/30 rounded-lg">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-8 text-center">Benefits of Copy Trading</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="flex items-start space-x-3 p-4">
                        <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-foreground">Access Expertise</h4>
                            <p className="text-sm text-muted-foreground">Tap into the knowledge and strategies of experienced market participants.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-3 p-4">
                        <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-foreground">Save Time</h4>
                            <p className="text-sm text-muted-foreground">Trades are copied automatically, ideal for those with limited time to research markets.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4">
                        <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-foreground">Learn by Observing</h4>
                            <p className="text-sm text-muted-foreground">Gain insights into successful trading techniques by observing copied trades.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-3 p-4">
                        <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-foreground">Portfolio Diversification</h4>
                            <p className="text-sm text-muted-foreground">Spread risk by copying multiple traders with different strategies.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4">
                        <CheckCircle className="h-6 w-6 text-positive mt-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-foreground">Full Control</h4>
                            <p className="text-sm text-muted-foreground">You decide who to copy, how much to allocate, and can stop copying anytime.</p>
                        </div>
                    </div>
                 </div>
            </div>
        </section>

        <section>
          <div className="grid md:grid-cols-2 gap-8">
            {copyTradingFeaturesData.slice(2, 4).map((feature) => {
              const imageData = imagesDataMap[feature.contextTag]; // imageService provides default if not found
              console.log(`[CopyTradingPage] SERVER: For feature "${feature.title}" (context: ${feature.contextTag}) - Using Image URL: "${imageData.imageUrl}", Alt: "${imageData.altText}"`);
              return (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-56 w-full">
                    <Image
                      src={imageData.imageUrl}
                      alt={imageData.altText}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg bg-muted"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <feature.icon className="h-8 w-8 text-accent mr-3" />
                      <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="text-center mt-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-4">Ready to Explore Copy Trading?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Sign up today to access our Copy Trading platform and start building your portfolio with the help of experienced traders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="accent">
              <Link href="/signup">Create an Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/copy-trading">Go to Copy Trading Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </GenericPageLayout>
  );
}
