
import GenericPageLayout from "@/components/layout/GenericPageLayout";
// import type { Metadata } from 'next'; // Metadata is fine in Server Components
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorSmartphone, Globe, Download, Zap, BarChart2, ShieldCheck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getImagesByContextTags, type ImageData } from "@/lib/imageService";

export const metadata = { // Static metadata can remain
  title: 'Trading Platforms - FPX Markets',
  description: 'Explore our advanced trading platforms. Features, downloads, and guides for WebTrader, Mobile Apps, and Desktop platforms.',
};

interface PlatformData {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  imageSrc?: string; // Now optional, will come from DB
  imageAlt?: string; // Now optional
  imageHint?: string; // Can be removed
  ctaLink: string;
  ctaLabel: string;
  contextTag: string; // Key for fetching image from DB
}

const platformsData: PlatformData[] = [
  {
    icon: Globe,
    title: "FPX WebTrader",
    description: "Access global markets directly from your browser. No downloads required, feature-rich, and user-friendly interface. Perfect for trading on the go or on any device.",
    features: ["Full Market Access", "Advanced Charting Tools", "One-Click Trading", "Secure & Reliable"],
    ctaLink: "#", // Placeholder
    ctaLabel: "Launch WebTrader",
    contextTag: "platform_web_promo",
  },
  {
    icon: MonitorSmartphone,
    title: "FPX Mobile Apps (iOS & Android)",
    description: "Trade anytime, anywhere with our native mobile applications. Get real-time quotes, manage your account, and execute trades with ease from your smartphone or tablet.",
    features: ["Full Account Management", "Push Notifications", "Interactive Charts", "Intuitive Interface"],
    ctaLink: "#", // Placeholder
    ctaLabel: "Download Mobile App",
    contextTag: "platform_mobile_promo",
  },
  {
    icon: Download,
    title: "FPX Desktop Trader",
    description: "For serious traders requiring maximum performance and customization. Our downloadable desktop platform offers advanced analytical tools and institutional-grade features.",
    features: ["Customizable Layouts", "Algorithmic Trading Support", "Advanced Order Types", "Depth of Market"],
    ctaLink: "#", // Placeholder
    ctaLabel: "Download Desktop",
    contextTag: "platform_desktop_promo",
  }
];

const platformBenefits = [
  { icon: Zap, title: "Speed & Reliability", description: "Execute trades with ultra-low latency and enjoy high uptime." },
  { icon: BarChart2, title: "Advanced Tools", description: "Utilize comprehensive charting, technical indicators, and analytical objects." },
  { icon: ShieldCheck, title: "Enhanced Security", description: "Trade with confidence thanks to robust security measures and data encryption." },
];

const DEFAULT_PLACEHOLDER_IMAGE_URL = 'https://placehold.co/600x400.png';

export default async function TradingPlatformsPage() {
  const contextTagsToFetch = platformsData.map(p => p.contextTag);
  const imagesData = await getImagesByContextTags(contextTagsToFetch);

  return (
    <GenericPageLayout
      title="Our Trading Platforms"
      description="Discover our suite of powerful and intuitive trading platforms. Available on Web, Desktop, and Mobile to suit your trading style and needs."
    >
      <div className="space-y-12">
        {platformsData.map((platform) => {
          const dbImage = imagesData[platform.contextTag] || { imageUrl: DEFAULT_PLACEHOLDER_IMAGE_URL, altText: `${platform.title} placeholder` };
          return (
            <Card key={platform.title} className="shadow-xl overflow-hidden grid md:grid-cols-2 gap-0 items-center">
              <div className="relative h-64 md:h-full w-full order-first md:order-none">
                <Image
                  src={dbImage.imageUrl!}
                  alt={dbImage.altText!}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <platform.icon className="h-10 w-10 text-accent mr-4" />
                  <CardTitle className="text-2xl text-primary">{platform.title}</CardTitle>
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
                <Button variant="accent" asChild>
                  <Link href={platform.ctaLink}>{platform.ctaLabel}</Link>
                </Button>
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
