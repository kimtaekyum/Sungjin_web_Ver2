import type { Metadata } from "next";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import { admissionResults, scoreImprovements, UNIVERSITY_LOGOS } from "@/data/results";

export const metadata: Metadata = {
  title: "합격 실적 | 2026 서울대·포항공대 합격 - 성진학원",
  description:
    "성진학원 2026학년도 합격 실적. 서울대 약대, 포항공대, 연세대, 고려대, 성균관대 등 상위권 대학 합격. 중등 성적 향상 사례.",
};

export default function ResultsPage() {
  return (
    <>
      {/* 대학 합격 실적 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title={<><span className="text-primary">2026학년도</span> 대학 합격 실적</>}
            subtitle={<>성진학원의 <span className="text-primary">검증된</span> 입시 결과</>}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {admissionResults.map((r, i) => {
              const logo = UNIVERSITY_LOGOS[r.university];
              return (
                <article
                  key={i}
                  className="group relative rounded-2xl bg-white border border-border/60 p-6 md:p-7 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* 로고 워터마크 배경 */}
                  {logo && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      <Image
                        src={logo.path}
                        alt=""
                        width={160}
                        height={160}
                        style={{ transform: `scale(${logo.scale ?? 1})` }}
                        className="object-contain w-28 h-28 md:w-36 md:h-36 opacity-[0.07] grayscale transition-opacity duration-300 group-hover:opacity-[0.14]"
                      />
                    </div>
                  )}

                  {/* 합격 체크 아이콘 */}
                  <span
                    aria-hidden
                    className="absolute top-3 right-3 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>

                  <h3 className="relative text-lg md:text-xl font-medium text-[#2C2C2A] tracking-tight">
                    {r.university}
                  </h3>
                  {r.department ? (
                    <p className="relative mt-2 text-sm text-text-sub leading-snug min-h-[2.5rem]">
                      {r.department}
                    </p>
                  ) : (
                    <p className="relative mt-2 text-sm text-text-hint leading-snug min-h-[2.5rem]">
                      &nbsp;
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 성적 향상 사례 */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title={<>중등 <span className="text-primary">성적 향상</span> 사례</>}
            subtitle={<><span className="text-primary">눈에 보이는</span> 성적 변화</>}
          />
          <div className="grid gap-3 grid-cols-2 md:gap-5 lg:grid-cols-3">
            {scoreImprovements.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-bg p-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4 md:p-6"
              >
                <span className="inline-block rounded-full bg-[#FDF2F2] px-2.5 py-1 text-xs font-medium text-primary md:px-3 md:py-1.5 md:text-sm">
                  {s.subject}
                </span>
                <div className="flex items-center gap-2 md:gap-3 md:flex-1">
                  <span className="text-base font-medium text-text-sub md:text-lg">
                    {s.before}
                  </span>
                  <svg className="h-4 w-4 text-success shrink-0 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-base font-medium text-success md:text-lg">
                    {s.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 학부모/학생 후기 — 홈과 동일한 캐러셀 */}
      <TestimonialCarousel />
    </>
  );
}
