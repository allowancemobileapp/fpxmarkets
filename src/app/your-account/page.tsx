import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Account - FPX Markets',
  description: 'Manage your FPX Markets trading account. View details, manage funds, and access account settings.',
};

export default function YourAccountPage() {
  return (
    <GenericPageLayout
      title="Your Account"
      description="Access and manage all aspects of your FPX Markets trading account. Securely view your profile, manage funds, and update settings."
    />
  );
}
