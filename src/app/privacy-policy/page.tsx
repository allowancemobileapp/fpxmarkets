'use client';

import GenericPageLayout from "@/components/layout/GenericPageLayout";
import { useEffect, useState } from "react";
import { format } from 'date-fns';

export default function PrivacyPolicyPage() {
  const [lastRevisedDate, setLastRevisedDate] = useState('');

  useEffect(() => {
    const exampleDate = new Date(2025, 0, 1);
    setLastRevisedDate(format(exampleDate, 'MMMM do, yyyy'));
  }, []);

  return (
    <GenericPageLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy outlines how fpxmarkets.net collects, uses, and protects your information."
    >
      <div className="space-y-6 text-foreground">
        <p className="text-sm text-muted-foreground">
          Last Revised: {lastRevisedDate}
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">Introduction</h2>
        <p>
          FPX Markets (“us“, “we”, or “Company“) respects the privacy of our users (each, “you” or “User“) and is committed to protecting the privacy of Users who access our website fpxmarkets.net, our mobile application, or any other online services we provide (collectively: the “Services“).
        </p>
        
        <h2 className="text-xl font-semibold text-primary pt-4">Data Usage</h2>
        <p>
          We use your data to provide and improve the Services. By using the Services, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="text-muted-foreground">
          Email: privacy@fpxmarkets.net
        </p>

        <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
                <strong>Disclaimer:</strong> This Privacy Policy governs the use of fpxmarkets.net and all related services.
            </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}
