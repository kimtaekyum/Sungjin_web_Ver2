import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "성진학원 | 대학 잘 보내는 1대1 맞춤 첨삭 전문 - 신월동 30년 입시 학원",
    template: "%s | 성진학원",
  },
  description:
    "신월동 성진학원 - 30년 전통의 1대1 밀착 첨삭 입시 전문 학원. 서울대·포항공대 합격 실적. 초4~고3 국영수 전 과목. 무료 상담 신청하세요.",
  keywords: [
    "신월동 학원",
    "신월동 입시 학원",
    "신월동 수학학원",
    "신월동 영어학원",
    "양천구 학원",
    "성진학원",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "성진학원 | 대학 잘 보내는 1대1 맞춤 첨삭 전문",
    description:
      "신월동 30년 전통 입시 전문 학원. 서울대·포항공대 합격. 1대1 밀착 첨삭 시스템.",
    type: "website",
    locale: "ko_KR",
    siteName: "성진학원",
    url: "/",
    images: [
      {
        url: "/images/logo@2x.png",
        width: 800,
        height: 185,
        alt: "성진학원",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "성진학원 | 대학 잘 보내는 1대1 맞춤 첨삭 전문",
    description:
      "신월동 30년 전통 입시 전문 학원. 서울대·포항공대 합격. 1대1 밀착 첨삭 시스템.",
    images: ["/images/logo@2x.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCTA />
        <Analytics />
      </body>
    </html>
  );
}
