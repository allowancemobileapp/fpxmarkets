
'use client';

import GenericPageLayout from "@/components/layout/GenericPageLayout";
import type { Metadata } from 'next'; // Although metadata is not used in client components, keeping for structure if we make parts server-side later
import { useEffect, useState } from "react";
import { format } from 'date-fns';

// export const metadata: Metadata = { // Metadata should be defined in a server component or layout if static
//   title: 'Privacy Policy - FPX Markets',
//   description: 'Understand how FPX Markets collects, uses, and protects your personal information.',
// };

export default function PrivacyPolicyPage() {
  const [lastRevisedDate, setLastRevisedDate] = useState('');

  useEffect(() => {
    setLastRevisedDate(format(new Date(), 'MMMM do, yyyy'));
  }, []);

  return (
    <GenericPageLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy outlines our practices concerning the collection, use, and disclosure of your information."
    >
      <div className="space-y-6 text-foreground">
        <p className="text-sm text-muted-foreground">
          Last Revised: {lastRevisedDate}
        </p>

        <h2 className="text-2xl font-semibold text-primary pt-4">Introduction</h2>
        <p>
          FPX Markets (“us“, “we”, or “Company“) respects the privacy of our users (each, “you” or “User“) and is committed to protecting the privacy of Users who access our website or any other online services we provide (collectively: the “Services“).
        </p>
        <p>
          The Company has prepared this Privacy Policy to outline our practices with respect to collecting, using, and disclosing your information when you use the Services. We encourage you to read the Privacy Policy carefully and use it to make informed decisions. By using the Services, you agree to the terms of this Privacy Policy, and your continued use of the Services constitutes your ongoing agreement to this Privacy Policy.
        </p>
        <p>
          This Privacy Policy is a part of our Terms of Service and is incorporated therein by reference. In this Privacy Policy, you will read about, among other things:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
          <li>What type of information we collect</li>
          <li>Cookies and similar technologies (like Google Analytics)</li>
          <li>How we use the information we collect</li>
          <li>With whom we share the information and for what purpose</li>
          <li>For how long we retain the information</li>
          <li>How we protect your information</li>
          <li>Third-party advertisements and services</li>
          <li>Your choices and rights regarding your information</li>
          <li>How to contact us</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary pt-4">1. What Type of Information We Collect</h2>
        <p className="text-muted-foreground">
          We may collect several types of information from and about users of our Services, including:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
          <li>
            <strong>Personal Identification Information:</strong> Such as your name, email address, postal address, phone number, date of birth, and other identifiers by which you may be contacted online or offline, especially when you register for an account, complete your profile, or contact us.
          </li>
          <li>
            <strong>Financial Information:</strong> Information related to your trading account, transaction history, deposits, and withdrawals when you use our financial services. This may include bank account details or cryptocurrency wallet addresses, as applicable.
          </li>
          <li>
            <strong>Verification Information (KYC/AML):</strong> To comply with legal and regulatory obligations, we may collect information for Know Your Customer (KYC) and Anti-Money Laundering (AML) purposes, such as government-issued identification documents and proof of address.
          </li>
          <li>
            <strong>Technical and Usage Information:</strong> Details of your visits to our Services, including traffic data, location data (if enabled), logs, IP address, browser type, operating system, device information, and other communication data and the resources that you access and use on the Services.
          </li>
          <li>
            <strong>Communication Information:</strong> Records and copies of your correspondence (including email addresses and chat logs) if you contact us or use our support services.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-primary pt-4">2. Cookies and Similar Technologies</h2>
        <p className="text-muted-foreground">
          Our Services use "cookies" and other similar technologies (e.g., web beacons, pixels, ad tags, and device identifiers) to enhance your user experience, analyze trends, administer the website, track users' movements around the website, and gather demographic information about our user base as a whole.
        </p>
        <p className="text-muted-foreground">
          A cookie is a small piece of data stored on your computer or mobile device by your web browser. We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period or until you delete them).
        </p>
        <p className="text-muted-foreground">
          We may use analytics partners, such as Google Analytics, to help analyze how users access and use the Services. Google Analytics uses cookies to collect information such as how often users visit the Services, what pages they visit, and what other sites they used prior to coming to the Services. We use the information we get from Google Analytics only to improve our Services.
        </p>
        <p className="text-muted-foreground">
          You can control the use of cookies at the individual browser level. If you reject cookies, you may still use our Services, but your ability to use some features or areas of our Services may be limited.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">3. How We Use the Information We Collect</h2>
        <p className="text-muted-foreground">
          We use information that we collect about you or that you provide to us, including any personal information, for purposes such as:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
          <li>To present our Services and their contents to you.</li>
          <li>To provide you with information, products, or services that you request from us.</li>
          <li>To fulfill any other purpose for which you provide it.</li>
          <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection (if applicable).</li>
          <li>To manage your account, process transactions, and provide customer support.</li>
          <li>To notify you about changes to our Services or any products or services we offer or provide through it.</li>
          <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
          <li>To improve our website, products, and services.</li>
          <li>For security purposes, such as preventing fraud and unauthorized access.</li>
          <li>To comply with applicable laws, regulations, and legal processes.</li>
          <li>For marketing and promotional communications, where you have provided consent.</li>
        </ul>

        <h2 className="text-xl font-semibold text-primary pt-4">4. With Whom We Share Your Information and For What Purpose</h2>
        <p className="text-muted-foreground">
          We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
        </p>
        <p className="text-muted-foreground">
          Specifically, we may share your information with:
        </p>
         <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
          <li>
            <strong>Service Providers:</strong> Third-party vendors, consultants, and other service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, KYC/AML verification, and marketing assistance.
          </li>
          <li>
            <strong>Regulatory Authorities and Law Enforcement:</strong> If required by law or in response to valid requests by public authorities (e.g., a court or a government agency).
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.
          </li>
          <li>
            <strong>Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
          </li>
        </ul>
        <p className="text-muted-foreground">
           Non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
        </p>


        <h2 className="text-xl font-semibold text-primary pt-4">5. For How Long We Retain Your Information</h2>
        <p className="text-muted-foreground">
          We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
        </p>
        <p className="text-muted-foreground">
          Account information is generally retained for the duration of the account's existence and for a reasonable period thereafter to allow for account reactivation or to comply with legal requirements.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">6. How We Protect Your Information</h2>
        <p className="text-muted-foreground">
          We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. These measures include data encryption, secure server environments, access controls, and regular security assessments.
        </p>
        <p className="text-muted-foreground">
          However, please remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">7. Third-Party Links and Advertisements</h2>
        <p className="text-muted-foreground">
          Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
        </p>
        <p className="text-muted-foreground">
          Our Services may also display advertisements from third parties. These advertisers may use cookies and similar technologies to collect information about your activities on our Services and other sites to provide you targeted advertising.
        </p>
        
        <h2 className="text-xl font-semibold text-primary pt-4">8. Your Choices and Rights</h2>
        <p className="text-muted-foreground">
          Depending on your jurisdiction, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict its processing. You may also have the right to object to processing and, where applicable, the right to data portability.
        </p>
        <p className="text-muted-foreground">
          You can typically manage your account information and communication preferences through your account settings. To exercise other rights, please contact us using the details provided below.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">9. Children's Privacy</h2>
        <p className="text-muted-foreground">
            Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">10. Changes to This Privacy Policy</h2>
        <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Revised" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-xl font-semibold text-primary pt-4">11. How to Contact Us</h2>
        <p className="text-muted-foreground">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="text-muted-foreground">
          Email: privacy@fpxmarkets-demo.com
        </p>
        <p className="text-muted-foreground">
          (Please note: This is a fictional contact address for demonstration purposes.)
        </p>

        <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
                <strong>Disclaimer:</strong> This is a sample Privacy Policy provided for illustrative purposes only. It is not a substitute for professional legal advice. You should consult with a legal professional to ensure your Privacy Policy is compliant with all applicable laws and regulations and accurately reflects your data processing practices.
            </p>
        </div>
      </div>
    </GenericPageLayout>
  );
}

    