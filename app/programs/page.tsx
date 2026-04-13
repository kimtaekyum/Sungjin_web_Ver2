import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "수업 안내 | 초등·중등·고등 프로그램 - 성진학원",
  description:
    "성진학원 초등부·중등부·고등부 교육과정. 1대1 첨삭 시스템으로 개념 완벽 흡수. 시험 4~6주 전 밀착 내신 관리.",
};

export default function ProgramsPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title="수업 안내"
            subtitle="초등부부터 고등부까지, 단계별 맞춤 교육 프로그램"
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

          {/* 수강료 종합표 */}
          <div className="mt-16">
            <SectionTitle title="수강료 종합 안내" />
            <div className="mx-auto max-w-lg">
              <Card hover={false} className="overflow-hidden p-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="px-6 py-3 text-left text-sm font-medium">과정</th>
                      <th className="px-6 py-3 text-center text-sm font-medium">수학</th>
                      <th className="px-6 py-3 text-center text-sm font-medium">영어</th>
                      <th className="px-6 py-3 text-center text-sm font-medium">국어</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-[#444444]">고등</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">36만</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">36만</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">26만</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-[#444444]">중등</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">26만</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">26만</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">15만</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-[#444444]">초등</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">23만</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">23만</td>
                      <td className="px-6 py-4 text-sm text-center text-text-sub">-</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
