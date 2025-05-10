import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata from 'next';

export const metadata: Metadata = {
  title: 'Trading Resources - FPX Markets',
  description: 'Educational materials, market analysis, trading tools, and FAQs to support your trading journey with FPX Markets.',
};

export default function ResourcesPage() {
  return (
    <GenericPageLayout
      title="Trading Resources"
      description="Enhance your trading knowledge with our extensive library of educational materials, market insights, and analytical tools."
    />
  );
}
