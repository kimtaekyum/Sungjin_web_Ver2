import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "수업 안내 | 초등·중등·고등 프로그램 - 성진학원",
  description:
    "성진학원 초등부·중등부·고등부 교육과정. 1대1 첨삭 시스템으로 개념 완벽 흡수. 시험 4~6주 전 밀착 내신 관리.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title="수업 안내"
            subtitle={<>초등부부터 고등부까지, 단계별 <span className="text-primary">맞춤</span> 교육 프로그램</>}
          />

          <div className="space-y-12">
            {programs.map((p) => (
              <div key={p.slug} id={p.slug} className="scroll-mt-24">
                <Card hover={false} className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:gap-10">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block rounded-full bg-bg px-3 py-1 text-sm font-medium text-text-sub">
                          {p.target}
                        </span>
                        <div className="flex gap-2">
                          {p.subjects.map((s) => (
                            <span
                              key={s}
                              className="inline-block rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-xs font-medium text-primary"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h2 className="text-2xl font-medium text-[#444444] mb-4">
                        {p.title} 프로그램
                      </h2>
                      <p className="text-text-sub leading-relaxed text-[15px] mb-6">
                        {p.description}
                      </p>
                      <h3 className="text-sm font-medium text-[#444444] mb-3">핵심 포인트</h3>
                      <ul className="space-y-2 mb-6">
                        {p.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text-sub">
                            <svg className="h-4 w-4 mt-0.5 shrink-0 text-success" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: Tuition + CTA */}
                    <div className="md:w-64 shrink-0">
                      <div className="rounded-xl bg-bg p-6">
                        <h3 className="text-sm font-medium text-[#444444] mb-4">수강료 안내</h3>
                        <div className="space-y-3">
                          {p.tuition.map((t, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-sm text-text-sub">{t.subject}</span>
                              <span className="text-sm font-medium text-primary">{t.price}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6">
                          <Button variant="primary" href="/contact" className="w-full text-sm">
                            {p.ctaText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* 운영 규정 */}
          <div className="mt-16">
            <SectionTitle title="운영 규정 안내" subtitle={<><span className="text-primary">투명</span>하고 <span className="text-primary">체계적인</span> 학원 운영</>} />
            <div className="grid gap-4 md:grid-cols-3">
              <Card hover={false} className="p-5 md:p-6">
                <h3 className="text-base font-medium text-primary mb-4">숙제 및 테스트</h3>
                <ul className="space-y-2 text-sm text-text-sub">
                  <li>• 수학: 백지 개념 테스트, 실전 모의고사로 이해도 점검</li>
                  <li>• 영문법: 문제 풀이 + 첨삭 선생님이 직접 발음 검사</li>
                  <li>• 수업 전후: 첨삭실에서 1대1 문제 풀이와 과제 완수</li>
                </ul>
              </Card>

              <Card hover={false} className="p-5 md:p-6">
                <h3 className="text-base font-medium text-primary mb-4">결석 및 보강</h3>
                <ul className="space-y-2 text-sm text-text-sub">
                  <li>• 고등 수학·중고등 국어: 매 수업 영상 촬영 → 보강 활용</li>
                  <li>• 결석·복습 필요 시 영상 보충 수강 가능</li>
                  <li>• 개별 보충 시급할 경우 별도 과외식 밀착 수업 가능</li>
                  <li>• 개별 진도 맞춤 숙제로 결손 방지</li>
                </ul>
              </Card>

              <Card hover={false} className="p-5 md:p-6">
                <h3 className="text-base font-medium text-primary mb-4">상담 및 소통</h3>
                <ul className="space-y-2 text-sm text-text-sub">
                  <li>• 매일 카톡: 초·중등 수업 출결·숙제 피드백</li>
                  <li>• 월간 리포트: 고사 없는 달에 고사결과·자기평가 보고서</li>
                  <li>• 진로 상담: 중3 2학기부터 High-act 분석으로 진로 관리</li>
                  <li>• 심층 면담: 성적 정체기 시 교사진 회의 후 1대1 면담</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* 수강료 종합표 */}
          <div className="mt-16">
            <SectionTitle title="수강료 종합 안내" />
            <div className="overflow-hidden rounded-xl bg-surface shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-3 py-3 text-left text-xs font-medium md:px-6 md:py-4 md:text-sm">과정</th>
                    <th className="px-3 py-3 text-center text-xs font-medium md:px-6 md:py-4 md:text-sm">수학</th>
                    <th className="px-3 py-3 text-center text-xs font-medium md:px-6 md:py-4 md:text-sm">영어</th>
                    <th className="px-3 py-3 text-center text-xs font-medium md:px-6 md:py-4 md:text-sm">국어</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-4 text-xs font-medium text-[#444444] md:px-6 md:py-5 md:text-sm">고등</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">36만</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">36만</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">26만</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-xs font-medium text-[#444444] md:px-6 md:py-5 md:text-sm">중등</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">26만</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">26만</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">15만</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-4 text-xs font-medium text-[#444444] md:px-6 md:py-5 md:text-sm">초등</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">23만</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">23만</td>
                    <td className="px-3 py-4 text-xs text-center text-text-sub md:px-6 md:py-5 md:text-sm">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
