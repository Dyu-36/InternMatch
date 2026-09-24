import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import StatsSection from "@/components/home/StatsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import CtaSection from "@/components/home/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedJobsSection />
      <StatsSection />
      <HowItWorksSection />
      <SolutionsSection />
      <CtaSection />
    </>
  );
}
