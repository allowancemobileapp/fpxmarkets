import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing & Spreads - FPX Markets',
  description: 'Transparent pricing, competitive spreads, and trading costs at FPX Markets. Understand our fee structure.',
};

export default function PricingPage() {
  return (
    <GenericPageLayout
      title="Competitive Pricing"
      description="Discover our transparent pricing model, tight spreads, and low commissions across all asset classes."
    />
  );
}
