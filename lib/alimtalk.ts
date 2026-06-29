import { SolapiMessageService } from "solapi";

/**
 * 상담 신청 → 관리자(원장님) 카카오 알림톡 발송.
 *
 * 보안/안전 원칙:
 * - API 키 등 모든 설정값은 환경변수에서만 읽는다 (코드/깃에 비밀값 없음).
 * - 환경변수가 하나라도 빠지면 발송을 "조용히 건너뛴다" → 상담 저장은 영향 없음.
 * - 호출부(route)에서 try/catch로 감싸 발송이 실패해도 상담 저장이 깨지지 않게 한다.
 *
 * 필요한 환경변수 (.env.local + Vercel):
 *   SOLAPI_API_KEY        솔라피 API Key
 *   SOLAPI_API_SECRET     솔라피 API Secret
 *   SOLAPI_PFID           발신프로필 ID (카카오 채널 연동 시 발급)
 *   SOLAPI_TEMPLATE_ID    승인된 알림톡 템플릿 ID
 *   SOLAPI_SENDER_PHONE   발신번호 (대체발송 SMS 발신용, 솔라피 등록번호)
 *   SOLAPI_ADMIN_PHONES   수신자(원장님) 번호. 여러 명이면 콤마로 구분
 */

const API_KEY = process.env.SOLAPI_API_KEY;
const API_SECRET = process.env.SOLAPI_API_SECRET;
const PF_ID = process.env.SOLAPI_PFID;
const TEMPLATE_ID = process.env.SOLAPI_TEMPLATE_ID;
const SENDER_PHONE = (process.env.SOLAPI_SENDER_PHONE ?? "").replace(/\D/g, "");
const ADMIN_PHONES = (process.env.SOLAPI_ADMIN_PHONES ?? "")
  .split(",")
  .map((s) => s.replace(/\D/g, ""))
  .filter((s) => s.length >= 10);

export function isAlimtalkConfigured(): boolean {
  return Boolean(
    API_KEY &&
      API_SECRET &&
      PF_ID &&
      TEMPLATE_ID &&
      SENDER_PHONE &&
      ADMIN_PHONES.length > 0
  );
}

export type ConsultationAlimtalkPayload = {
  parentName: string;
  phoneDisplay: string; // 010-1234-5678
  grade: string;
  subjects: string[];
  preferredTime: string | null;
  memo: string | null;
};

/**
 * 알림톡 변수 값은 비어 있으면 카카오가 거부하므로 항상 기본값을 채운다.
 * 또한 본문 총 길이가 1000자를 넘으면 발송이 실패할 수 있어 메모는 넉넉히 잘라낸다.
 */
function buildVariables(p: ConsultationAlimtalkPayload): Record<string, string> {
  const memo = (p.memo ?? "").trim();
  return {
    "#{학부모명}": p.parentName || "미입력",
    "#{연락처}": p.phoneDisplay || "미입력",
    "#{학년}": p.grade || "미입력",
    "#{과목}": p.subjects.length > 0 ? p.subjects.join(", ") : "미선택",
    "#{희망시간}": p.preferredTime?.trim() || "미입력",
    "#{메모}": memo ? memo.slice(0, 500) : "없음",
  };
}

/**
 * 관리자 전원에게 상담 알림톡을 보낸다. 설정이 없으면 건너뛴다.
 * 실패 시 예외를 던지므로 호출부에서 try/catch 할 것.
 */
export async function sendConsultationAlimtalk(
  p: ConsultationAlimtalkPayload
): Promise<void> {
  if (!isAlimtalkConfigured()) {
    console.warn("[alimtalk] 환경변수 미설정 — 발송 건너뜀");
    return;
  }

  const messageService = new SolapiMessageService(API_KEY!, API_SECRET!);
  const variables = buildVariables(p);

  const messages = ADMIN_PHONES.map((to) => ({
    to,
    from: SENDER_PHONE,
    kakaoOptions: {
      pfId: PF_ID!,
      templateId: TEMPLATE_ID!,
      variables,
      disableSms: false, // 카톡 수신 불가 시 대체발송(SMS) 허용
    },
  }));

  await messageService.send(messages);
}
