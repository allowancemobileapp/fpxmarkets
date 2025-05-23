
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Handshake, Users, BarChart, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: 'Partnerships - FPX Markets',
  description: 'Explore partnership opportunities with FPX Markets. Become an Introducing Broker (IB) or Affiliate and grow with us.',
};

const partnershipTypes = [
  {
    icon: Handshake,
    title: "Introducing Broker (IB) Program",
    description: "Refer clients to FPX Markets and earn competitive commissions based on their trading activity. We provide comprehensive support, marketing materials, and advanced reporting tools to help you succeed.",
    benefits: ["High commission rates", "Personalized IB portal", "Marketing tools & resources", "Dedicated support"],
    imageSrc: "https://placehold.co/600x400.png",
    imageHint: "business handshake deal"
  },
  {
    icon: Users,
    title: "Affiliate Program",
    description: "Monetize your online traffic by promoting FPX Markets. Earn attractive CPA (Cost Per Acquisition) or revenue share for every qualified client you refer through your unique affiliate link.",
    benefits: ["Flexible commission models (CPA, RevShare)", "High conversion rates", "Real-time tracking & reporting", "Promotional materials"],
    imageSrc: "https://placehold.co/600x401.png",
    imageHint: "affiliate marketing network"
  }
];

export default function PartnersPage() {
  return (
    <GenericPageLayout
      title="Partner with FPX Markets"
      description="Join FPX Markets as a partner. Explore our Introducing Broker and Affiliate programs designed for mutual success and growth in the financial markets."
    >
      <div className="space-y-12">
        {partnershipTypes.map((program) => (
          <Card key={program.title} className="shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0 items-center">
                <div className="relative h-64 md:h-full w-full">
                <Image
                  src={program.imageSrc}
                  alt={program.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={program.imageHint}
                />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <program.icon className="h-10 w-10 text-accent mr-4" />
                  <CardTitle className="text-2xl text-primary">{program.title}</CardTitle>
                </div>
                <p className="text-muted-foreground mb-6 text-base leading-relaxed">{program.description}</p>
                <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-6">
                  {program.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
                </ul>
                <Button variant="outline" asChild>
                  <Link href="/contact?subject=PartnershipInquiry">Learn More & Apply</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <section className="py-12 bg-secondary/30 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-6">Why Partner with Us?</h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3 p-3">
                <BarChart className="h-7 w-7 text-positive mt-1 flex-shrink-0"/>
                <div>
                  <h4 className="font-semibold text-foreground">Advanced Technology</h4>
                  <p className="text-sm text-muted-foreground">Offer your clients access to our cutting-edge trading platforms and tools.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3">
                <ShieldCheck className="h-7 w-7 text-positive mt-1 flex-shrink-0"/>
                <div>
                  <h4 className="font-semibold text-foreground">Trusted & Regulated</h4>
                  <p className="text-sm text-muted-foreground">Partner with a brokerage committed to transparency and security (Regulatory status placeholder).</p>
                </div>
              </div>
            </div>
            <Button asChild size="lg" variant="accent" className="mt-10">
              <Link href="/contact?subject=PartnershipInquiry">Become a Partner Today</Link>
            </Button>
          </div>
        </section>
      </div>
    </GenericPageLayout>
  );
}
