import type { Metadata } from "next";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import Accordion from "@/components/ui/Accordion";
import FaIcon from "@/components/ui/FaIcon";
import { ACADEMY_INFO } from "@/lib/constants";
import { faqItems } from "@/data/faq";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import ConsultForm from "./ConsultForm";

export const metadata: Metadata = {
  title: "상담 & 등록 | 성진학원 - 무료 상담 신청",
  description:
    "성진학원 온라인 상담 신청. 초4~고3 국영수 입시 전문. 전화, 카카오톡, 온라인 폼으로 편하게 문의하세요.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <FaqJsonLd items={faqItems} />
      {/* 상담 신청 + 오시는 길 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title="상담 & 등록"
            subtitle={<>부담 없이 문의해주세요. <span className="text-primary">영업일 1일 이내</span> 연락드립니다.</>}
          />

          <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
            {/* 상담 신청 폼 */}
            <div className="rounded-xl bg-surface border border-border/50 p-6 md:p-8">
              <h3 className="text-lg font-medium text-[#444444] mb-6">
                온라인 상담 신청
              </h3>
              <ConsultForm />
            </div>

            {/* 오시는 길 */}
            <div className="flex flex-col gap-6 h-full">
              <div className="flex-1 rounded-xl bg-surface border border-border/50 p-6 md:p-8">
                <h3 className="text-lg font-medium text-[#444444] mb-4">
                  오시는 길
                </h3>
                <a
                  href={ACADEMY_INFO.naverMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="네이버 지도에서 성진학원 위치 보기"
                  className="group relative block overflow-hidden rounded-xl aspect-video mb-4 border border-border/50 hover:border-primary/40 transition-colors"
                >
                  <Image
                    src="/images/map.png"
                    alt="성진학원 위치 지도"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority
                  />

                  {/* 핀 (학원 위치 강조) */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative -translate-y-2">
                      <span className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-md animate-ping" />
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow-lg ring-4 ring-white/80">
                        <FaIcon name="location-dot" className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* 좌상단 배지: 네이버 지도 연동 느낌 */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-text shadow-sm">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#03C75A]" />
                    NAVER 지도
                  </div>

                  {/* 우하단 CTA: 호버 시 강조 */}
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-text shadow-sm transition-colors group-hover:bg-primary group-hover:text-white">
                    지도에서 길찾기
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </a>
                <dl className="mt-6 divide-y divide-border/50 text-sm">
                  {/* 주소 */}
                  <div className="flex items-start gap-4 py-4">
                    <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary">
                      <FaIcon name="location-dot" className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs font-medium tracking-wider text-text-hint uppercase mb-1">
                        Address
                      </dt>
                      <dd className="text-text leading-relaxed">{ACADEMY_INFO.address}</dd>
                      <dd className="text-text-hint text-xs mt-1">{ACADEMY_INFO.addressLegacy}</dd>
                    </div>
                  </div>

                  {/* 전화 */}
                  <div className="flex items-start gap-4 py-4">
                    <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary">
                      <FaIcon name="phone" className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs font-medium tracking-wider text-text-hint uppercase mb-1">
                        Phone
                      </dt>
                      <dd>
                        <a
                          href={`tel:${ACADEMY_INFO.phone}`}
                          className="text-primary font-medium hover:underline tabular-nums"
                        >
                          {ACADEMY_INFO.phone}
                        </a>
                      </dd>
                    </div>
                  </div>

                  {/* 운영시간 */}
                  <div className="flex items-start gap-4 py-4">
                    <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary">
                      <FaIcon name="clock" className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs font-medium tracking-wider text-text-hint uppercase mb-1">
                        Hours
                      </dt>
                      <dd className="text-text leading-relaxed">{ACADEMY_INFO.operatingHours}</dd>
                    </div>
                  </div>
                </dl>

                <p className="mt-4 pt-4 border-t border-border/50 text-xs text-text-hint">
                  {ACADEMY_INFO.registrationNo}
                </p>
              </div>

              {/* 빠른 연락 */}
              <div className="flex gap-3">
                <a
                  href={`tel:${ACADEMY_INFO.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary text-white py-4 font-medium hover:bg-[#8A1519] transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  전화 상담
                </a>
                <a
                  href={ACADEMY_INFO.kakaoLink}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] text-[#3C1E1E] py-4 font-medium hover:bg-[#FDD800] transition-colors"
                >
                  카카오톡 상담
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="자주 묻는 질문" subtitle={<><span className="text-primary">궁금한 점</span>을 확인해보세요</>} />
          <div className="mx-auto max-w-3xl">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>
    </>
  );
}
