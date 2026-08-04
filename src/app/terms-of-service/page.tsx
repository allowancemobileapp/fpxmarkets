'use client';

import GenericPageLayout from "@/components/layout/GenericPageLayout";
import { useEffect, useState } from "react";
import { format } from 'date-fns';

export default function TermsOfServicePage() {
  const [lastRevisedDate, setLastRevisedDate] = useState('');

  useEffect(() => {
    setLastRevisedDate(format(new Date(2024, 11, 20), 'MMMM do, yyyy'));
  }, []);

  return (
    <GenericPageLayout
      title="Terms of Service"
      description="Please read these Terms of Service carefully before using our services."
    >
      <div className="space-y-6 text-foreground">
        <p className="text-sm text-muted-foreground">
          Last Revised: {lastRevisedDate}
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing and using the FPX Markets website (fpxmarkets.net) and services (collectively, the "Services"), you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">10. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions about these Terms, please contact us at legal@fpxmarkets.net.
        </p>

        <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
                <strong>Disclaimer:</strong> These terms govern your relationship with FPX Markets.
            </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}
