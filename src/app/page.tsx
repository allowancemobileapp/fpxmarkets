
'use client'; // Required for framer-motion components

import HeroSection from "@/components/sections/HeroSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import MarketInsights from "@/components/sections/MarketInsights";
import ContactForm from "@/components/sections/ContactForm";
import { Separator } from "@/components/ui/separator";
import TradingPlansSection from "@/components/sections/TradingPlansSection";
import ThreeStepsSection from "@/components/sections/ThreeStepsSection";
import AnimatedSection from "@/components/AnimatedSection"; // Import the wrapper

export default function Home() {
  return (
    <div className="flex flex-col">
      <AnimatedSection>
        <HeroSection />
      </AnimatedSection>

      <AnimatedSection delay={0.1}> {/* Optional: add slight delay for staggered effect */}
        <ThreeStepsSection />
      </AnimatedSection>
      
      <Separator className="my-8 md:my-12" />
      
      <AnimatedSection delay={0.2}>
        <ServicesOverview />
      </AnimatedSection>
      
      <Separator className="my-8 md:my-12" />
      
      <AnimatedSection delay={0.3}>
        <TradingPlansSection />
      </AnimatedSection>
      
      <Separator className="my-8 md:my-12" />
      
      <AnimatedSection delay={0.4}>
        <MarketInsights />
      </AnimatedSection>
      
      <Separator className="my-8 md:my-12" />
      
      <AnimatedSection delay={0.5}>
        <ContactForm />
      </AnimatedSection>
    </div>
  );
}
