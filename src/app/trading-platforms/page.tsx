import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Platforms - FPX Markets',
  description: 'Explore our advanced trading platforms. Features, downloads, and guides for WebTrader, Mobile Apps, and Desktop platforms.',
};

export default function TradingPlatformsPage() {
  return (
    <GenericPageLayout
      title="Trading Platforms"
      description="Discover our suite of powerful and intuitive trading platforms. Available on Web, Desktop, and Mobile to suit your trading style."
    />
  );
}
