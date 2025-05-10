import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partnerships - FPX Markets',
  description: 'Explore partnership opportunities with FPX Markets. Become an Introducing Broker or Affiliate.',
};

export default function PartnersPage() {
  return (
    <GenericPageLayout
      title="Partnership Programs"
      description="Join FPX Markets as a partner. Explore our Introducing Broker and Affiliate programs designed for mutual success."
    />
  );
}
