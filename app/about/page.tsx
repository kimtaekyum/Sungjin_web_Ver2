import type { Metadata } from "next";
import Image from "next/image";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import StrengthCards from "@/components/home/StrengthCards";
import { ACADEMY_INFO } from "@/lib/constants";
import { philosophies } from "@/data/philosophy";

const FACILITY_PHOTOS = [
  { src: "/images/facility-1.jpg", alt: "성진학원 시설 1" },
  { src: "/images/facility-2.jpg", alt: "성진학원 시설 2" },
  { src: "/images/facility-3.jpg", alt: "성진학원 시설 3" },
  { src: "/images/facility-4.jpg", alt: "성진학원 시설 4" },
  { src: "/images/facility-5.jpg", alt: "성진학원 시설 5" },
  { src: "/images/facility-6.jpg", alt: "성진학원 시설 6" },
];

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
          <SectionTitle title="학원소개" subtitle={<>신월동 <span className="text-primary">30년</span>, 학생의 성장을 <span className="text-primary">책임</span>집니다</>} />

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
          <SectionTitle title="교육철학" subtitle={<>성진학원이 추구하는 <span className="text-primary">4가지 핵심 가치</span></>} />
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
      <StrengthCards />

      {/* 시설 안내 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="시설 안내" subtitle={<><span className="text-primary">쾌적한</span> 학습 환경을 제공합니다</>} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {FACILITY_PHOTOS.map((photo, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border border-border/50 aspect-[4/3] bg-surface"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-text shadow-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <FaIcon name="school" className="w-3 h-3" />
                  시설 {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
