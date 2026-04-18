import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "성진학원 | 신월동 30년 전통 1대1 밀착 첨삭 입시 전문",
  description:
    "신월동 성진학원 - 30년 전통의 1대1 밀착 첨삭 입시 전문 학원. 서울대·포항공대 합격 실적. 초4~고3 국영수 전 과목. 무료 상담 신청하세요.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 3600;

import HeroSection from "@/components/home/HeroSection";
import PhotoStrip from "@/components/home/PhotoStrip";
import StatsCounter from "@/components/home/StatsCounter";

import StrengthCards from "@/components/home/StrengthCards";
import ProgramPreview from "@/components/home/ProgramPreview";
import AdmissionHighlight from "@/components/home/AdmissionHighlight";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import BlogAndCalendar from "@/components/home/BlogAndCalendar";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PhotoStrip />
      <StatsCounter />

      <StrengthCards />
      <ProgramPreview />
      <AdmissionHighlight />
      <BlogAndCalendar />
      <TestimonialCarousel />
    </>
  );
}
