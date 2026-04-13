import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";

import StrengthCards from "@/components/home/StrengthCards";
import ProgramPreview from "@/components/home/ProgramPreview";
import AdmissionHighlight from "@/components/home/AdmissionHighlight";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import QuickConsult from "@/components/home/QuickConsult";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsCounter />

      <StrengthCards />
      <ProgramPreview />
      <AdmissionHighlight />
      <TestimonialCarousel />
      <QuickConsult />
    </>
  );
}
