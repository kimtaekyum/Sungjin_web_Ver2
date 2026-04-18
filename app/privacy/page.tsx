import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import { ACADEMY_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "개인정보 처리방침 | 성진학원",
  description: "성진학원 개인정보 처리방침",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[840px] px-4">
        <SectionTitle
          title="개인정보 처리방침"
          subtitle={`${ACADEMY_INFO.name}은(는) 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.`}
        />

        <div className="rounded-xl bg-surface border border-border/50 p-6 md:p-10 space-y-10 text-[15px] leading-[1.8] text-text">
          <p className="text-sm text-text-sub">
            본 개인정보 처리방침은 <strong>2026년 4월 14일</strong>부터 적용됩니다.
          </p>

          {/* 1 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              1. 수집하는 개인정보 항목
            </h2>
            <p className="text-text-sub mb-3">
              {ACADEMY_INFO.name}은(는) 상담 신청을 위해 아래의 최소한의 개인정보를 수집합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-sub pl-2">
              <li>
                <strong>필수 항목</strong>: 학부모명, 연락처, 학생의 학년 구분(초등/중등/고등)
              </li>
              <li>
                <strong>선택 항목</strong>: 관심 과목, 상담 희망 시간대, 문의 메모
              </li>
            </ul>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <p className="text-text-sub mb-3">
              수집한 개인정보는 다음의 목적으로만 이용되며, 목적이 변경될 경우 사전 동의를 받습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-sub pl-2">
              <li>상담 신청자 본인 확인 및 연락</li>
              <li>학원 수업·상담 일정 안내</li>
              <li>상담 내용에 맞는 커리큘럼 제안 및 관련 안내</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="text-text-sub mb-3">
              원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 아래의 경우에는 명시한 기간 동안 보관합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-sub pl-2">
              <li>상담 신청자 정보: 상담 완료 후 1년</li>
              <li>학원 수강생으로 전환된 경우: 수강 종료 후 3년</li>
              <li>관련 법령에 따라 보존이 필요한 정보: 해당 법령에서 정한 기간</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-text-sub">
              {ACADEMY_INFO.name}은(는) 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 법령에 의거하거나 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우에는 예외로 합니다.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              5. 개인정보의 파기 절차 및 방법
            </h2>
            <ul className="list-disc list-inside space-y-1 text-text-sub pl-2">
              <li>
                <strong>파기 절차</strong>: 이용 목적 달성 후 즉시 또는 보유 기간 경과 후 내부 방침에 따라 파기합니다.
              </li>
              <li>
                <strong>파기 방법</strong>: 전자적 파일은 복구 불가능한 기술적 방법으로 삭제하며, 종이 문서는 분쇄하거나 소각합니다.
              </li>
            </ul>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              6. 이용자의 권리와 행사 방법
            </h2>
            <p className="text-text-sub mb-3">
              이용자는 언제든지 자신의 개인정보에 대해 아래의 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-sub pl-2">
              <li>개인정보 열람 요청</li>
              <li>오류가 있는 경우 정정 요청</li>
              <li>삭제 및 처리 정지 요청</li>
            </ul>
            <p className="text-text-sub mt-3">
              권리 행사는 아래 연락처로 문의주시면 지체 없이 조치하겠습니다.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              7. 개인정보 보호책임자 및 문의처
            </h2>
            <div className="rounded-lg bg-bg border border-border/50 p-5 space-y-2 text-text-sub">
              <p>
                <strong className="text-text">기관명</strong> · {ACADEMY_INFO.name}
              </p>
              <p>
                <strong className="text-text">주소</strong> · {ACADEMY_INFO.address}
              </p>
              <p>
                <strong className="text-text">전화</strong> ·{" "}
                <a href={`tel:${ACADEMY_INFO.phone}`} className="text-primary hover:underline">
                  {ACADEMY_INFO.phone}
                </a>
              </p>
              <p>
                <strong className="text-text">등록번호</strong> · {ACADEMY_INFO.registrationNo}
              </p>
            </div>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-lg font-medium text-[#444444] mb-3">
              8. 방침의 변경
            </h2>
            <p className="text-text-sub">
              본 개인정보 처리방침의 내용 추가·삭제 및 수정이 있을 시에는 홈페이지의 공지사항을 통해 변경 이유 및 내용 등을 사전에 공지합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
