
import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'More Information - FPX Markets',
  description: 'Discover more sections and resources available at FPX Markets. Explore further to enhance your trading experience.',
};

const moreLinks = [
  { href: "/about", label: "About Us" }, // Added About Us link
  { href: "/pricing", label: "Pricing" },
  { href: "/partners", label: "Partners" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact Us" },
  // Add other links that might be relevant under "More"
];


export default function MorePage() {
  return (
    <GenericPageLayout
      title="Explore More"
      description="Find additional information, resources, and tools provided by FPX Markets to support your trading activities."
    >
        <div className="space-y-6">
            <p className="text-lg text-foreground">
                This section provides access to further details about our services and offerings. 
                Below are some key areas you might be interested in:
            </p>
            <ul className="list-disc list-inside space-y-3 pl-4">
                {moreLinks.map(link => (
                    <li key={link.href} className="text-base">
                        <Link href={link.href} className="text-primary hover:underline font-medium">
                            {link.label}
                        </Link>
                         <span className="text-muted-foreground ml-2">- Explore our {link.label.toLowerCase()} details.</span>
                    </li>
                ))}
            </ul>
            <p className="text-muted-foreground">
                If you can't find what you're looking for, please don't hesitate to use our site search or contact our support team.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
