
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorSmartphone, Globe, Download, Zap, BarChart2, ShieldCheck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getImagesByContextTags, type ImageData } from "@/lib/imageService";

export const metadata = {
  title: 'Trading Platforms - FPX Markets',
  description: 'Explore our advanced trading platforms. Features, downloads, and guides for WebTrader, Mobile Apps, and Desktop platforms.',
};

interface PlatformDefinition {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  ctaLink: string;
  ctaLabel: string;
  contextTag: string;
}

const platformsData: PlatformDefinition[] = [
  {
    icon: Globe,
    title: "FPX WebTrader",
    description: "Access global markets directly from your browser. No downloads required, feature-rich, and user-friendly interface. Perfect for trading on the go or on any device.",
    features: ["Full Market Access", "Advanced Charting Tools", "One-Click Trading", "Secure & Reliable"],
    ctaLink: "/dashboard", // Assuming dashboard is the webtrader or leads to it
    ctaLabel: "Launch WebTrader",
    contextTag: "platform_web_promo",
  },
  {
    icon: MonitorSmartphone,
    title: "FPX Mobile Apps (iOS & Android)",
    description: "Trade anytime, anywhere with our native mobile applications. Get real-time quotes, manage your account, and execute trades with ease from your smartphone or tablet.",
    features: ["Full Account Management", "Push Notifications", "Interactive Charts", "Intuitive Interface"],
    ctaLink: "#", // Placeholder for app store links
    ctaLabel: "Download Mobile App",
    contextTag: "platform_mobile_promo",
  },
  {
    icon: Download,
    title: "FPX Desktop Trader",
    description: "For serious traders requiring maximum performance and customization. Our downloadable desktop platform offers advanced analytical tools and institutional-grade features.",
    features: ["Customizable Layouts", "Algorithmic Trading Support", "Advanced Order Types", "Depth of Market"],
    ctaLink: "#", // Placeholder for download link
    ctaLabel: "Download Desktop",
    contextTag: "platform_desktop_promo",
  }
];

const platformBenefits = [
  { icon: Zap, title: "Speed & Reliability", description: "Execute trades with ultra-low latency and enjoy high uptime." },
  { icon: BarChart2, title: "Advanced Tools", description: "Utilize comprehensive charting, technical indicators, and analytical objects." },
  { icon: ShieldCheck, title: "Enhanced Security", description: "Trade with confidence thanks to robust security measures and data encryption." },
];

export default async function TradingPlatformsPage() {
  const contextTagsToFetch = platformsData.map(p => p.contextTag);
  console.log('[TradingPlatformsPage] SERVER: Defined contextTagsToFetch:', JSON.stringify(contextTagsToFetch));

  let imagesDataMap: Record<string, ImageData> = {};
  try {
    imagesDataMap = await getImagesByContextTags(contextTagsToFetch);
    console.log('[TradingPlatformsPage] SERVER: Successfully fetched imagesDataMap:', JSON.stringify(imagesDataMap, null, 2));
  } catch (error) {
    console.error('[TradingPlatformsPage] SERVER: Error fetching imagesDataMap from imageService:', error);
    // Initialize with defaults if fetching fails so the page doesn't break and uses placeholders from service.
    // The imageService itself now robustly returns placeholders.
    platformsData.forEach(p => {
      if (!imagesDataMap[p.contextTag]) { // Ensure entry if service somehow errored badly
        imagesDataMap[p.contextTag] = { imageUrl: 'https://placehold.co/600x400.png', altText: `${p.title} (service error fallback)` };
      }
    });
  }

  return (
    <GenericPageLayout
      title="Our Trading Platforms"
      description="Discover our suite of powerful and intuitive trading platforms. Available on Web, Desktop, and Mobile to suit your trading style and needs."
    >
      <div className="space-y-12">
        {platformsData.map((platform, index) => {
          const imageOnLeft = index % 2 === 0;
          
          const imageData = imagesDataMap[platform.contextTag]; // Service now guarantees this has valid imageUrl/altText
          
          // These will always be strings due to the robust imageService
          const imageUrl = imageData.imageUrl; 
          const altText = imageData.altText;

          console.log(`[TradingPlatformsPage] SERVER: For platform "${platform.title}" (context: ${platform.contextTag}) - Using Image URL: "${imageUrl}", Alt: "${altText}"`);

          return (
            <Card key={platform.title} className="shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0 items-center">
                {/* Image Column */}
                <div className={`relative h-64 md:h-[450px] w-full ${imageOnLeft ? 'md:order-first' : 'md:order-last'}`}>
                  <Image
                    src={imageUrl} // Directly use, should always be valid
                    alt={altText}    // Directly use
                    layout="fill"
                    objectFit="cover"
                    priority={index < 2} 
                    className="bg-muted" // Add a background color for loading/error states
                  />
                </div>
                {/* Text Content Column */}
                <div className={`p-6 sm:p-10 ${imageOnLeft ? 'md:order-last' : 'md:order-first'}`}>
                  <div className="flex items-center mb-4">
                    <platform.icon className="h-10 w-10 text-accent mr-4 flex-shrink-0" />
                    <CardTitle className="text-2xl lg:text-3xl text-primary">{platform.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">{platform.description}</p>
                  <ul className="space-y-2 mb-6">
                    {platform.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm text-foreground">
                        <CheckCircle className="h-5 w-5 text-positive mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="accent" size="lg" asChild>
                    <Link href={platform.ctaLink}>{platform.ctaLabel}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        <section className="py-12 bg-secondary/30 rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-10 text-center">Why Choose FPX Platforms?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platformBenefits.map((benefit) => (
                <Card key={benefit.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                  <CardHeader>
                    <benefit.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                    <CardTitle className="text-xl text-primary">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

         <div className="text-center mt-12">
          <p className="text-lg text-foreground mb-4">Ready to experience our platforms?</p>
          <Button asChild size="lg" variant="default">
            <Link href="/signup">Open an Account</Link>
          </Button>
        </div>
      </div>
    </GenericPageLayout>
  );
}
