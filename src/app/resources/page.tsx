
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Film, BarChart2, HelpCircle, Feather } from "lucide-react";

export const metadata: Metadata = {
  title: 'Trading Resources - FPX Markets',
  description: 'Educational materials, market analysis, trading tools, and FAQs to support your trading journey with FPX Markets.',
};

const resourceCategories = [
  {
    icon: BookOpen,
    title: "Educational Articles & Guides",
    description: "Deepen your understanding of trading concepts, strategies, and market analysis with our comprehensive articles. Suitable for both beginners and experienced traders.",
    linkText: "Browse Articles",
    linkHref: "#articles", // Placeholder
    imageSrc: "https://picsum.photos/seed/resArticles/600/400",
    imageHint: "education learning books"
  },
  {
    icon: Film,
    title: "Video Tutorials & Webinars",
    description: "Watch expert-led video tutorials on platform usage, technical analysis, and trading psychology. Join our live webinars for interactive learning sessions.",
    linkText: "Watch Videos",
    linkHref: "#videos", // Placeholder
    imageSrc: "https://picsum.photos/seed/resVideos/600/401",
    imageHint: "video tutorial play"
  },
  {
    icon: Feather, // Using Feather for "Market Analysis & News"
    title: "Market Analysis & News",
    description: "Stay informed with daily market commentary, technical analysis reports, and breaking financial news that could impact your trades.",
    linkText: "Read Analysis",
    linkHref: "#analysis", // Placeholder
    imageSrc: "https://picsum.photos/seed/resAnalysis/600/402",
    imageHint: "financial news charts"
  },
  {
    icon: BarChart2, // Using BarChart2 for "Trading Tools"
    title: "Trading Tools & Calculators",
    description: "Utilize our suite of trading tools, including economic calendars, pip calculators, and volatility trackers to make more informed decisions.",
    linkText: "Access Tools",
    linkHref: "#tools", // Placeholder
    imageSrc: "https://picsum.photos/seed/resTools/600/403",
    imageHint: "charts graphs tools"
  },
  {
    icon: HelpCircle,
    title: "FAQ & Support Center",
    description: "Find answers to frequently asked questions about our services, platforms, account management, and more. Our support team is also ready to assist.",
    linkText: "Visit FAQ",
    linkHref: "/contact",
    imageSrc: "https://picsum.photos/seed/resSupport/600/404",
    imageHint: "support helpdesk communication"
  }
];

export default function ResourcesPage() {
  return (
    <GenericPageLayout
      title="Trading Resources & Education"
      description="Enhance your trading knowledge and skills with FPX Markets' extensive library of educational materials, market insights, analytical tools, and dedicated support."
    >
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourceCategories.map((category) => (
            <Card key={category.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={category.imageSrc}
                  alt={category.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={category.imageHint}
                />
              </div>
              <CardHeader className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <category.icon className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                  <CardTitle className="text-xl text-primary leading-tight">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              </CardContent>
              <div className="p-5 pt-0 border-t mt-auto">
                <Button variant="link" asChild className="text-accent font-semibold px-0 mt-3">
                  <Link href={category.linkHref}>{category.linkText}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-16 py-8 bg-secondary/30 rounded-lg">
            <h3 className="text-2xl font-semibold text-primary mb-4">Empower Your Trading Journey</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                At FPX Markets, we are committed to providing you with the resources you need to succeed. 
                Explore, learn, and trade with confidence.
            </p>
            <Button asChild size="lg" variant="accent">
                <Link href="/signup">Open an Account</Link>
            </Button>
        </div>
      </div>
    </GenericPageLayout>
  );
}
