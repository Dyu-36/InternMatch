import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import StatsSection from "@/components/home/StatsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import SolutionsSection from "@/components/home/SolutionsSection";
import CtaSection from "@/components/home/CtaSection";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ScrollReveal><CategoriesSection /></ScrollReveal>
      <ScrollReveal><FeaturedJobsSection /></ScrollReveal>
      <ScrollReveal><StatsSection /></ScrollReveal>
      <ScrollReveal><HowItWorksSection /></ScrollReveal>
      <ScrollReveal><SolutionsSection /></ScrollReveal>
      <ScrollReveal><CtaSection /></ScrollReveal>
    </>
  );
}
