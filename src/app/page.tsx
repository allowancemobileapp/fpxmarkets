
import { Suspense } from 'react';
import HeroSection from "@/components/sections/HeroSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import MarketInsights from "@/components/sections/MarketInsights";
import ContactForm from "@/components/sections/ContactForm";
import { Separator } from "@/components/ui/separator";
import TradingPlansSection from "@/components/sections/TradingPlansSection";
import ThreeStepsSection from "@/components/sections/ThreeStepsSection";
import ClientAnimator from "@/components/ClientAnimator"; // New Client Component for animations
import { Loader2 } from 'lucide-react';

const ServiceLoader = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">Loading services overview...</p>
  </div>
);

// page.tsx is now a Server Component (no 'use client' directive)
export default function Home() {
  return (
    <div className="flex flex-col">
      <ClientAnimator>
        <HeroSection />
      </ClientAnimator>

      <ClientAnimator delay={0.1}>
        <ThreeStepsSection />
      </ClientAnimator>

      <Separator className="my-8 md:my-12" />

      <ClientAnimator delay={0.2}>
        <Suspense fallback={<ServiceLoader />}>
          <ServicesOverview /> {/* Now correctly rendered by a Server Component parent */}
        </Suspense>
      </ClientAnimator>

      <Separator className="my-8 md:my-12" />

      <ClientAnimator delay={0.3}>
        <TradingPlansSection />
      </ClientAnimator>

      <Separator className="my-8 md:my-12" />

      <ClientAnimator delay={0.4}>
        <MarketInsights />
      </ClientAnimator>

      <Separator className="my-8 md:my-12" />

      <ClientAnimator delay={0.5}>
        <ContactForm />
      </ClientAnimator>
    </div>
  );
}
