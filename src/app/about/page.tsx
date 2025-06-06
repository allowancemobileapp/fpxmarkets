
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Zap, Handshake, ShieldCheck, Users, TrendingUp, Scale, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: 'About FPX Markets - Our Mission, Values, and Story',
  description: 'Learn more about FPX Markets, our commitment to traders, innovative technology, and the values that drive us.',
};

const values = [
  { icon: Target, title: "Client Focus", description: "Our clients are at the heart of everything we do. We strive to provide an unparalleled trading experience." },
  { icon: Zap, title: "Innovation", description: "We leverage cutting-edge technology to deliver fast, reliable, and intuitive trading platforms." },
  { icon: ShieldCheck, title: "Integrity & Trust", description: "Transparency and security are paramount. We operate with the highest ethical standards." },
  { icon: Handshake, title: "Partnership", description: "We believe in building long-term relationships with our clients, offering support and guidance." },
];

const whyChooseUs = [
    { icon: TrendingUp, title: "Competitive Spreads", description: "Access tight spreads across a wide range of financial instruments." },
    { icon: Users, title: "Dedicated Support", description: "Our expert support team is available to assist you 24/5." },
    { icon: Scale, title: "Transparent Pricing", description: "No hidden fees. Clear and straightforward trading costs." },
    { icon: Lightbulb, title: "Advanced Trading Tools", description: "Utilize sophisticated charting, analytics, and risk management tools." },
];

export default function AboutUsPage() {
  return (
    <GenericPageLayout
      title="About FPX Markets"
      description="Empowering traders with advanced technology, comprehensive market access, and unwavering support."
    >
      <div className="space-y-12">
        {/* Our Mission & Vision Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-6 text-center">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-lg text-foreground">
              <p>
                At FPX Markets, our mission is to democratize access to global financial markets. We aim to provide traders of all levels – from beginners to seasoned professionals – with the tools, resources, and support they need to navigate the complexities of trading and achieve their financial aspirations.
              </p>
              <p>
                Our vision is to be a leading online brokerage, recognized for our technological innovation, client-centric approach, and commitment to fostering a secure and transparent trading environment. We aspire to continuously evolve, adapting to market changes and client needs to offer a superior trading experience.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://picsum.photos/seed/aboutGlobalNet/600/400"
                alt="Global financial network"
                layout="fill"
                objectFit="cover"
                data-ai-hint="global network finance"
                className="opacity-90"
              />
            </div>
          </div>
        </section>

        {/* Our Core Values Section */}
        <section className="py-12 bg-secondary/30 rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-10 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                  <CardHeader>
                    <value.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                    <CardTitle className="text-xl text-primary">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Story Section (Placeholder) */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-6 text-center">Our Story</h2>
           <div className="grid md:grid-cols-2 gap-8 items-center">
             <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl order-last md:order-first">
              <Image
                src="https://picsum.photos/seed/aboutTeamWork/600/401"
                alt="FPX Markets team working"
                layout="fill"
                objectFit="cover"
                data-ai-hint="team collaboration office"
                className="opacity-90"
              />
            </div>
            <div className="space-y-4 text-lg text-foreground">
                <p>
                Founded by a team of passionate finance and technology professionals, FPX Markets was born from the desire to create a more accessible, transparent, and user-friendly trading experience. We saw an opportunity to bridge the gap between institutional-grade trading tools and the everyday trader.
                </p>
                <p className="text-muted-foreground">
                (More details about our journey, milestones, and team will be shared here soon. We are proud of our heritage and the expertise that drives our platform forward.)
                </p>
            </div>
          </div>
        </section>

        {/* Why Choose FPX Markets Section */}
        <section className="py-12">
             <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-10 text-center">Why Choose FPX Markets?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => (
                <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <item.icon className="h-8 w-8 text-accent" />
                    <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
        </section>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="accent">
            <Link href="/signup">Join FPX Markets Today</Link>
          </Button>
          <p className="mt-4 text-muted-foreground">
            Ready to start your trading journey? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> for any questions.
          </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}
