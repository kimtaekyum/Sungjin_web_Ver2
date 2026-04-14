import Image from "next/image";
import Button from "@/components/ui/Button";
import { ACADEMY_INFO } from "@/lib/constants";
import { UNIVERSITY_LOGOS } from "@/data/results";

// Hero 상단에 표시할 대표 대학 9개 (3×3)
const HERO_UNIVERSITIES = [
  "서울대", "연세대", "성균관대",
  "포항공대", "고려대", "한양대",
  "동국대", "건국대", "인하대",
];

// 합격 대학 티커 (가로 스크롤)
const ALL_ADMITTED = [
  "서울대", "포항공대", "연세대", "고려대", "성균관대",
  "한양대", "동국대", "건국대", "인하대", "원광대", "전북대",
];

export default function HeroSection() {
  return (
    <section className="relative bg-[#2C2C2A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2A] via-[#3a3a38] to-[#1f1f1d]" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/4 right-[15%] w-[600px] h-[600px] bg-[#B81D22]/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-[20%] w-[450px] h-[450px] bg-[#D4A84B]/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 pt-28 pb-20 md:pt-40 md:pb-32">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
          {/* ===== Left: Text ===== */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-6 ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-white/85 text-xs font-medium tracking-wide">
                신월동 {ACADEMY_INFO.established}년 전통 입시 전문 학원
              </span>
            </div>

            <h1 className="text-[34px] font-semibold leading-[1.1] text-white sm:text-[44px] md:text-[58px] md:leading-[1.05] tracking-tight">
              대학 잘 보내는
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#FF5A5F] via-[#FF7B7B] to-[#FFB199] bg-clip-text text-transparent">
                  1대1 맞춤 첨삭
                </span>
                <span className="absolute left-0 -bottom-1 h-[3px] w-full bg-gradient-to-r from-[#FF5A5F]/60 to-transparent rounded-full" />
              </span>{" "}
              전문
              <br />
              <span className="text-white">성진학원</span>
            </h1>

            <p className="mt-6 text-white/70 text-[15px] leading-relaxed md:text-lg md:mt-8 max-w-lg">
              {ACADEMY_INFO.subSlogan}
            </p>

            {/* Key stats */}
            <div className="mt-7 flex flex-wrap gap-6 md:gap-8">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    {ACADEMY_INFO.established}
                  </span>
                  <span className="text-base md:text-lg text-white/70 font-medium">년</span>
                </div>
                <p className="mt-0.5 text-xs md:text-sm text-white/50">신월동 전통</p>
              </div>
              <div className="h-10 w-px bg-white/15 self-center" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    1:1
                  </span>
                </div>
                <p className="mt-0.5 text-xs md:text-sm text-white/50">밀착 첨삭</p>
              </div>
              <div className="h-10 w-px bg-white/15 self-center" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    초4
                  </span>
                  <span className="text-sm md:text-base text-white/60 font-medium">~</span>
                  <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    고3
                  </span>
                </div>
                <p className="mt-0.5 text-xs md:text-sm text-white/50">전 학년 국·영·수</p>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" href="/contact">
                무료 상담 신청하기
              </Button>
              <Button
                variant="ghost"
                href="/programs"
                className="border-white/25 text-white hover:bg-white/10 hover:text-white hover:border-white/40 bg-transparent"
              >
                수업 안내 보기
              </Button>
            </div>
          </div>

          {/* ===== Right: Trophy Wall (desktop) ===== */}
          <div className="hidden md:block relative">
            {/* Caption */}
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-white/50">
                <span className="h-px w-6 bg-white/30" />
                2026 합격 대학
              </span>
              <span className="text-xs text-white/40 tabular-nums">
                {ALL_ADMITTED.length}+ 대학
              </span>
            </div>

            {/* 3×3 Logo Grid */}
            <div className="relative">
              {/* Soft glow behind grid */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#FF5A5F]/10 via-transparent to-[#D4A84B]/10 rounded-[2rem] blur-2xl" />

              <div className="relative grid grid-cols-3 gap-2.5">
                {HERO_UNIVERSITIES.map((uni, i) => {
                  const logo = UNIVERSITY_LOGOS[uni];
                  return (
                    <div
                      key={uni}
                      className="group relative aspect-square rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 p-3 flex items-center justify-center transition-all duration-300 hover:bg-white/[0.12] hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {/* Check badge (top-right) */}
                      <span className="absolute top-1.5 right-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/90 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>

                      {logo ? (
                        <Image
                          src={logo.path}
                          alt={uni}
                          width={120}
                          height={120}
                          style={{ transform: `scale(${(logo.scale ?? 1) * 0.85})` }}
                          className="object-contain w-full h-full opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      ) : (
                        <span className="text-sm font-medium text-white/70">{uni}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom: Admission Ticker (all sizes) ===== */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="shrink-0 text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase text-white/40">
              Admission
            </span>
            <div className="relative flex-1 overflow-hidden">
              {/* Fade masks on both edges */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#2C2C2A] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#2C2C2A] to-transparent z-10" />

              <div className="flex gap-8 animate-hero-marquee whitespace-nowrap">
                {[...ALL_ADMITTED, ...ALL_ADMITTED].map((uni, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 text-sm md:text-base text-white/70"
                  >
                    <svg className="h-3 w-3 text-primary/80" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {uni}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
