import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import { ACADEMY_INFO } from "@/lib/constants";
import { philosophies } from "@/data/philosophy";
import { strengths } from "@/data/strengths";

export const metadata: Metadata = {
  title: "학원소개 | 성진학원 - 신월동 30년 입시 전문 학원",
  description:
    "성진학원의 교육철학과 강점을 소개합니다. 1대1 밀착 첨삭, 대입 세미나, 클래스톡톡 등 체계적인 교육 시스템.",
};

export default function AboutPage() {
  return (
    <>
      {/* 인사말 & 교육철학 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="학원소개" subtitle="신월동 30년, 학생의 성장을 책임집니다" />

          {/* 소개문 */}
          <div className="mx-auto max-w-3xl mb-16">
            <div className="rounded-xl bg-surface border border-border/50 p-8 md:p-10">
              <h3 className="text-lg font-medium text-[#444444] mb-4">원장 인사말</h3>
              <p className="text-text-sub leading-relaxed text-[15px] md:text-base">
                {ACADEMY_INFO.description}
              </p>
            </div>
          </div>

          {/* 교육철학 */}
          <SectionTitle title="교육철학" subtitle="성진학원이 추구하는 4가지 핵심 가치" />
          <div className="grid gap-5 sm:grid-cols-2">
            {philosophies.map((p, i) => (
              <Card key={i} className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FDF2F2] flex items-center justify-center text-primary">
                    <FaIcon name={p.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#444444] mb-2">
                      {p.keyword}
                    </h3>
                    <p className="text-sm text-text-sub leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 강점 6가지 상세 */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="성진학원 6가지 강점" subtitle="학생의 성장을 위한 체계적인 교육 시스템" />
          <div className="space-y-6">
            {strengths.map((s) => (
              <div
                key={s.id}
                className="rounded-xl bg-bg p-6 md:p-8 flex items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FDF2F2] flex items-center justify-center text-primary">
                  <FaIcon name={s.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#444444] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-text-sub leading-relaxed text-[15px]">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 시설 안내 플레이스홀더 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="시설 안내" subtitle="쾌적한 학습 환경을 제공합니다" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {["상담실", "첨삭실", "자습실", "교실", "복도", "입구"].map((name, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface border border-border/50 aspect-[4/3] flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-text-hint mb-2">
                    <FaIcon name="school" className="w-7 h-7 mx-auto" />
                  </div>
                  <p className="text-sm text-text-sub">{name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
