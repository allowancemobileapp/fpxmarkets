import GenericPageLayout from "@/components/layout/GenericPageLayout";
import ContactForm from "@/components/sections/ContactForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - FPX Markets',
  description: 'Get in touch with FPX Markets. Find our contact details, office locations, or use our contact form for support.',
};

export default function ContactPage() {
  return (
    <GenericPageLayout
      title="Contact Us"
      description="We're here to help. Reach out to our support team via phone, email, or by using the contact form below."
    >
      <div className="mt-0"> {/* Adjusted margin, GenericPageLayout already has padding */}
        <ContactForm />
      </div>
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold text-primary mb-4">Other Ways to Reach Us</h3>
        <p className="text-muted-foreground mb-2">
          <strong>Client Support Email:</strong> support@fpxmarkets-demo.com
        </p>
        <p className="text-muted-foreground mb-2">
          <strong>Phone (Toll-Free):</strong> +1 (800) 555-0199
        </p>
        <p className="text-muted-foreground">
          <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (GMT)
        </p>
      </div>
    </GenericPageLayout>
  );
}
