import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import Accordion from "@/components/ui/Accordion";
import FaIcon from "@/components/ui/FaIcon";
import { ACADEMY_INFO } from "@/lib/constants";
import { faqItems } from "@/data/faq";
import ConsultForm from "./ConsultForm";

export const metadata: Metadata = {
  title: "상담 & 등록 | 성진학원 - 무료 상담 신청",
  description:
    "성진학원 온라인 상담 신청. 초4~고3 국영수 입시 전문. 전화, 카카오톡, 온라인 폼으로 편하게 문의하세요.",
};

export default function ContactPage() {
  return (
    <>
      {/* 상담 신청 + 오시는 길 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle
            title="상담 & 등록"
            subtitle="부담 없이 문의해주세요. 영업일 1일 이내 연락드립니다."
          />

          <div className="grid gap-8 md:grid-cols-2">
            {/* 상담 신청 폼 */}
            <div className="rounded-xl bg-surface border border-border/50 p-6 md:p-8">
              <h3 className="text-lg font-medium text-[#444444] mb-6">
                온라인 상담 신청
              </h3>
              <ConsultForm />
            </div>

            {/* 오시는 길 */}
            <div className="space-y-6">
              <div className="rounded-xl bg-surface border border-border/50 p-6 md:p-8">
                <h3 className="text-lg font-medium text-[#444444] mb-4">
                  오시는 길
                </h3>
                <a
                  href={ACADEMY_INFO.naverMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-bg aspect-video flex items-center justify-center mb-4 hover:bg-border/30 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-primary mb-2">
                      <FaIcon name="location-dot" className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-sm font-medium text-text">네이버 지도에서 보기</p>
                    <p className="text-xs text-text-hint mt-1">클릭하면 네이버 지도로 이동합니다</p>
                  </div>
                </a>
                <div className="space-y-2 text-sm text-text-sub">
                  <p><strong className="text-text">주소:</strong> {ACADEMY_INFO.address}</p>
                  <p className="text-text-hint">{ACADEMY_INFO.addressLegacy}</p>
                  <p>
                    <strong className="text-text">전화:</strong>{" "}
                    <a href={`tel:${ACADEMY_INFO.phone}`} className="text-primary hover:underline">
                      {ACADEMY_INFO.phone}
                    </a>
                  </p>
                  <p><strong className="text-text">운영시간:</strong> {ACADEMY_INFO.operatingHours}</p>
                  <p className="text-text-hint">{ACADEMY_INFO.registrationNo}</p>
                </div>
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

      {/* 운영 규정 */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="운영 규정 안내" subtitle="투명하고 체계적인 학원 운영" />

          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-xl bg-bg p-6 md:p-8">
              <h3 className="text-base font-medium text-[#444444] mb-4">숙제 및 테스트</h3>
              <ul className="space-y-2 text-sm text-text-sub">
                <li>• 중등부 수학: 백지 개념 테스트, 실전 모의고사로 이해도 점검</li>
                <li>• 영문법: 문제 풀이 + 첨삭 선생님이 직접 발음 검사</li>
                <li>• 수업 전후: 첨삭실에서 1대1 문제 풀이와 과제 완수</li>
              </ul>
            </div>

            <div className="rounded-xl bg-bg p-6 md:p-8">
              <h3 className="text-base font-medium text-[#444444] mb-4">결석 및 보강</h3>
              <ul className="space-y-2 text-sm text-text-sub">
                <li>• 고등 수학·중고등 국어: 매 수업 영상 촬영 → 보강 활용</li>
                <li>• 결석·복습 필요 시 영상 보충 수강 가능</li>
                <li>• 개별 보충 시급할 경우 별도 과외식 밀착 수업 가능</li>
                <li>• 개별 진도 맞춤 숙제로 결손 방지</li>
              </ul>
            </div>

            <div className="rounded-xl bg-bg p-6 md:p-8">
              <h3 className="text-base font-medium text-[#444444] mb-4">상담 및 소통</h3>
              <ul className="space-y-2 text-sm text-text-sub">
                <li>• 매일 카톡: 초·중등 수업 출결·숙제 피드백</li>
                <li>• 월간 리포트: 정기고사 없는 달에 월별 고사 결과·자기평가 보고서</li>
                <li>• 진로 상담: 중3 2학기부터 High-act 분석으로 진로 관리</li>
                <li>• 심층 면담: 성적 정체기 시 교사진 회의 후 1대1 면담</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionTitle title="자주 묻는 질문" subtitle="궁금한 점을 확인해보세요" />
          <div className="mx-auto max-w-3xl">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>
    </>
  );
}
