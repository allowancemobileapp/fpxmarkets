
'use client';

import GenericPageLayout from "@/components/layout/GenericPageLayout";
import { useEffect, useState } from "react";
import { format } from 'date-fns';

export default function TermsOfServicePage() {
  const [lastRevisedDate, setLastRevisedDate] = useState('');

  useEffect(() => {
    setLastRevisedDate(format(new Date(), 'MMMM do, yyyy'));
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
          By accessing and using the FPX Markets website and services (collectively, the "Services"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">2. Service Description</h2>
        <p className="text-muted-foreground">
          FPX Markets provides an online platform for simulated trading of financial instruments, including but not limited to Forex, CFDs on Shares, Commodities, Indices, and Digital Currencies. The Services are provided for informational and educational purposes and involve simulated funds only. No real money trading is conducted on this platform for standard user accounts unless explicitly stated otherwise for specific, regulated services.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">3. User Responsibilities</h2>
        <p className="text-muted-foreground">
          You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You agree to provide true, accurate, current, and complete information about yourself as prompted by the registration form.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">4. Risk Disclosure</h2>
        <p className="text-muted-foreground">
          Trading financial instruments, even in a simulated environment, involves risk. The simulated trading offered by FPX Markets is for educational and practice purposes. Past performance in a simulated environment is not indicative of future results in live trading. You acknowledge that you understand these risks.
        </p>
        
        <h2 className="text-xl font-semibold text-primary pt-4">5. Intellectual Property</h2>
        <p className="text-muted-foreground">
          The Site and its original content, features, and functionality are owned by FPX Markets and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">6. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          In no event shall FPX Markets, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service. As this platform is for demonstration and simulation, no liability will be accepted for any perceived financial losses based on simulated activities.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">7. Termination</h2>
        <p className="text-muted-foreground">
          We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">8. Governing Law</h2>
        <p className="text-muted-foreground">
          These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction - Placeholder], without regard to its conflict of law provisions.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">9. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">10. Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions about these Terms, please contact us at legal@fpxmarkets-demo.com.
        </p>
        <p className="text-muted-foreground">
          (Please note: This is a fictional contact address for demonstration purposes.)
        </p>

        <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
                <strong>Disclaimer:</strong> This is a sample Terms of Service document provided for illustrative purposes only. It is not a substitute for professional legal advice. You should consult with a legal professional to ensure your Terms of Service are compliant with all applicable laws and regulations and are appropriate for your specific business operations.
            </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}

    