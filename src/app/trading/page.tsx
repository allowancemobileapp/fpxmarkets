import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Information - FPX Markets',
  description: 'Learn about trading conditions, order types, leverage, and risk management at FPX Markets.',
};

export default function TradingPage() {
  return (
    <GenericPageLayout
      title="Trading with FPX Markets"
      description="Comprehensive information on our trading conditions, available instruments, order execution, and essential trading tools."
    />
  );
}
