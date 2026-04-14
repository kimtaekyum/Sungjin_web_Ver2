import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import { admissionResults, scoreImprovements } from "@/data/results";

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
            title="2026학년도 대학 합격 실적"
            subtitle="성진학원의 검증된 입시 결과"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {admissionResults.map((r, i) => (
              <article
                key={i}
                className="group relative rounded-2xl bg-white border border-border/60 p-6 md:p-7 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
              >
                {/* 합격 체크 아이콘 */}
                <span
                  aria-hidden
                  className="absolute top-3 right-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>

                <h3 className="text-lg md:text-xl font-medium text-[#2C2C2A] tracking-tight">
                  {r.university}
                </h3>
                {r.department ? (
                  <p className="mt-2 text-sm text-text-sub leading-snug min-h-[2.5rem]">
                    {r.department}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-text-hint leading-snug min-h-[2.5rem]">
                    &nbsp;
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 성적 향상 사례 */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title="중등 성적 향상 사례"
            subtitle="눈에 보이는 성적 변화"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {scoreImprovements.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-bg p-6 flex items-center gap-4"
              >
                <span className="inline-block rounded-full bg-[#FDF2F2] px-3 py-1.5 text-sm font-medium text-primary">
                  {s.subject}
                </span>
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg font-medium text-text-sub">
                    {s.before}
                  </span>
                  <svg className="h-5 w-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-lg font-medium text-success">
                    {s.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 학부모/학생 후기 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title="학부모·학생 후기"
            subtitle="성진학원과 함께한 이야기"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                content: "첨삭 시스템 덕분에 아이가 수업에서 배운 내용을 확실히 이해하고 옵니다. 성적이 눈에 띄게 올랐어요.",
                author: "중2 학부모",
              },
              {
                content: "고등부 입시 상담이 정말 체계적입니다. 교수부장님의 1:1 로드맵 덕분에 대학 진학 방향이 명확해졌어요.",
                author: "고3 학부모",
              },
              {
                content: "매일 카톡으로 아이의 학습 상황을 알려주셔서 안심이 됩니다. 30년 경력답게 관리가 꼼꼼해요.",
                author: "초5 학부모",
              },
              {
                content: "수학 31점에서 71점까지 올랐습니다. 백지 테스트로 개념을 확실히 잡아주시더라고요.",
                author: "중3 학생",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface border border-border/50 p-6 md:p-8"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="h-4 w-4 text-[#D4A84B]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text leading-relaxed text-[15px] mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
                <p className="text-sm text-text-sub font-medium">
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
