
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'More Information - FPX Markets',
  description: 'Discover more sections and resources available at FPX Markets. Explore further to enhance your trading experience.',
};

const moreLinks = [
  { href: "/quick-start", label: "Quick Start Guide", description: "Your first steps to trading with FPX Markets." },
  { href: "/trading-platforms", label: "Trading Platforms", description: "Explore our WebTrader, Mobile, and Desktop platforms." },
  { href: "/trading", label: "Trading Information", description: "Learn about instruments, leverage, and risk management." },
  { href: "/copy-trading", label: "Copy Trading", description: "Explore how to follow and copy strategies from experienced traders." },
  { href: "/markets", label: "Markets Overview", description: "Discover the range of markets available for trading." },
  { href: "/pricing", label: "Pricing & Spreads", description: "Understand our transparent fee structure and competitive trading costs." },
  { href: "/about", label: "About Us", description: "Learn about our mission, values, and the team behind FPX Markets." },
  { href: "/partners", label: "Partnership Programs", description: "Discover opportunities to collaborate with FPX Markets." },
  { href: "/resources", label: "Trading Resources", description: "Access educational materials, market analysis, and trading tools." },
  { href: "/privacy-policy", label: "Privacy Policy", description: "Read how we handle and protect your personal data." },
  { href: "/contact", label: "Contact Us", description: "Get in touch with our support team for any inquiries." },
];


export default function MorePage() {
  return (
    <GenericPageLayout
      title="Explore More Sections"
      description="Find additional information, resources, and tools provided by FPX Markets to support your trading activities and enhance your understanding of our services."
    >
        <div className="space-y-6">
            <p className="text-lg text-foreground">
                FPX Markets offers a comprehensive suite of services and information. 
                Navigate through the sections below to find what you're looking for:
            </p>
            <ul className="space-y-4">
                {moreLinks.map(link => (
                    <li key={link.href} className="border-b pb-3">
                        <Link href={link.href} className="text-xl text-primary hover:underline font-semibold block mb-1">
                            {link.label}
                        </Link>
                         <span className="text-muted-foreground text-sm">{link.description}</span>
                    </li>
                ))}
            </ul>
            <p className="text-muted-foreground mt-8">
                If you can't find what you're looking for, please don't hesitate to use our site search (if available) or contact our support team directly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
        </div>
    </GenericPageLayout>
  );
}

    