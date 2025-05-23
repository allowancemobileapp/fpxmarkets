import HeroSection from "@/components/sections/HeroSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import MarketInsights from "@/components/sections/MarketInsights";
import ContactForm from "@/components/sections/ContactForm";
import { Separator } from "@/components/ui/separator";
import TradingPlansSection from "@/components/sections/TradingPlansSection";
import ThreeStepsSection from "@/components/sections/ThreeStepsSection"; // Import the new section

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ThreeStepsSection /> {/* Add the new section here */}
      <Separator className="my-8 md:my-12" />
      <ServicesOverview />
      <Separator className="my-8 md:my-12" />
      <TradingPlansSection />
      <Separator className="my-8 md:my-12" />
      <MarketInsights />
      <Separator className="my-8 md:my-12" />
      <ContactForm />
    </div>
  );
}
