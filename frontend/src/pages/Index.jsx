import { Header } from "@/components/layout/Header.jsx";
import { Footer } from "@/components/layout/Footer.jsx";
import { HeroSection } from "@/components/home/HeroSection.jsx";
import { FeaturesSection } from "@/components/home/FeaturesSection.jsx";
import { RecentIncidents } from "@/components/home/RecentIncidents.jsx";
import { CTASection } from "@/components/home/CTASection.jsx";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <RecentIncidents />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;