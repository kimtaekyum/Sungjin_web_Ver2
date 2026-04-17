import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { admissionResults, UNIVERSITY_LOGOS } from "@/data/results";

export default function AdmissionHighlight() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-bg to-surface/40 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionTitle
          title={<><span className="text-primary">2026학년도</span> 합격 실적</>}
          subtitle={<>성진학원의 <span className="text-primary">검증된</span> 입시 결과</>}
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {admissionResults.slice(0, 8).map((r, i) => {
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
                      sizes="(max-width: 768px) 128px, 160px"
                      style={{ transform: `scale(${logo.scale ?? 1})` }}
                      className="object-contain w-32 h-32 md:w-40 md:h-40 opacity-[0.18] transition-opacity duration-300 group-hover:opacity-[0.35]"
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

                <h3 className="relative text-xl md:text-2xl font-medium text-[#2C2C2A] tracking-tight">
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

        <div className="mt-12 text-center">
          <Button variant="ghost" href="/results">
            더 많은 실적 보기 →
          </Button>
        </div>
      </div>
    </section>
  );
}
