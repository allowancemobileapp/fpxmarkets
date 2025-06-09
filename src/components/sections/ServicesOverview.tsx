
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Landmark, TrendingUp, Bitcoin, Briefcase, BarChart3, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { getImagesByContextTags, type ImageData } from "@/lib/imageService"; // Import the service

interface ServiceDefinition {
  icon: React.ElementType;
  title: string;
  description: string;
  contextTag: string; // For fetching from DB
}

const serviceDefinitions: ServiceDefinition[] = [
  { icon: Landmark, title: "Forex Trading", description: "Trade major, minor, and exotic currency pairs with low spreads.", contextTag: 'services_forex' },
  { icon: TrendingUp, title: "Share CFDs", description: "Access global stock markets and trade CFDs on leading companies.", contextTag: 'services_shares_cfds' },
  { icon: Bitcoin, title: "Digital Currencies", description: "Explore the world of cryptocurrencies with our secure platform.", contextTag: 'services_digital_currencies' },
  { icon: Briefcase, title: "Commodities", description: "Trade popular commodities like gold, oil, and agricultural products.", contextTag: 'services_commodities' },
  { icon: BarChart3, title: "Indices", description: "Speculate on the performance of global stock market indices.", contextTag: 'services_indices' },
  { icon: ShieldCheck, title: "Secure Platforms", description: "Trade with confidence on our robust and reliable trading platforms.", contextTag: 'services_secure_platforms' }
];

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/400x250.png';

export default async function ServicesOverview() {
  const contextTags = serviceDefinitions.map(s => s.contextTag);
  const imagesDataMap = await getImagesByContextTags(contextTags);

  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Comprehensive Trading Solutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover a wide range of markets and tools to enhance your trading experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceDefinitions.map((service) => {
            const imageData = imagesDataMap[service.contextTag];
            const imageUrl = imageData?.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;
            const altText = imageData?.altText || service.title; // Fallback alt text to service title

            return (
              <Card key={service.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image 
                    src={imageUrl} 
                    alt={altText} 
                    layout="fill" 
                    objectFit="cover"
                    // data-ai-hint can be removed if images from DB are considered final
                  />
                </div>
                <CardHeader className="flex-row items-start gap-4 p-6">
                  <service.icon className="h-10 w-10 text-accent mt-1" />
                  <div>
                    <CardTitle className="text-xl font-semibold text-primary">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-grow">
                  <CardDescription className="text-base text-muted-foreground">{service.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
