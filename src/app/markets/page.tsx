import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets Overview - FPX Markets',
  description: 'Explore the wide range of global markets available for trading at FPX Markets, including Forex, Shares, Indices, and Commodities.',
};

export default function MarketsPage() {
  return (
    <GenericPageLayout
      title="Global Markets"
      description="Access a diverse range of financial markets. Trade Forex, Shares, Indices, Commodities, and Digital Currencies with FPX Markets."
    />
  );
}
