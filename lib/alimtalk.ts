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
  gradeDetail: string; // 예: 초등학교 2학년
  school: string | null; // 예: 강서초 (없으면 null)
  subjects: string[];
  preferredDate: string | null; // YYYY-MM-DD (상담 희망 날짜)
  preferredTime: string | null;
  memo: string | null;
};

/** 2026-07-10 → "7월 10일(금)" */
function formatKoreanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][
    new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  ];
  return `${m}월 ${d}일(${weekday})`;
}

/**
 * 알림톡 변수 값은 비어 있으면 카카오가 거부하므로 항상 기본값을 채운다.
 * 또한 본문 총 길이가 1000자를 넘으면 발송이 실패할 수 있어 메모는 넉넉히 잘라낸다.
 */
function buildVariables(p: ConsultationAlimtalkPayload): Record<string, string> {
  const memo = (p.memo ?? "").trim();
  // 승인된 템플릿의 '학년' 변수 하나에 상세 학년 + 학교를 함께 담는다.
  // 예: "초등학교 2학년 · 강서초"
  const gradeText = p.school
    ? `${p.gradeDetail} · ${p.school}`
    : p.gradeDetail || "미입력";
  // 승인된 템플릿의 '희망시간' 변수 하나에 날짜 + 시간대를 함께 담는다.
  // 예: "7월 10일(금) · 평일 오후 3~5시"
  const preferredText =
    [
      p.preferredDate ? formatKoreanDate(p.preferredDate) : "",
      p.preferredTime?.trim() ?? "",
    ]
      .filter(Boolean)
      .join(" · ") || "미입력";
  return {
    "#{학부모명}": p.parentName || "미입력",
    "#{연락처}": p.phoneDisplay || "미입력",
    "#{학년}": gradeText,
    "#{과목}": p.subjects.length > 0 ? p.subjects.join(", ") : "미선택",
    "#{희망시간}": preferredText,
    "#{메모}": memo ? memo.slice(0, 500) : "없음",
  };
}

/** 문자(LMS) 본문 — 알림톡과 동일한 내용을 변수 값으로 조립한다. */
function buildSmsText(variables: Record<string, string>): string {
  return [
    "[성진학원] 새 상담 신청이 접수되었습니다",
    "",
    `▶ 학부모: ${variables["#{학부모명}"]}`,
    `▶ 연락처: ${variables["#{연락처}"]}`,
    `▶ 학년: ${variables["#{학년}"]}`,
    `▶ 과목: ${variables["#{과목}"]}`,
    `▶ 희망시간: ${variables["#{희망시간}"]}`,
    `▶ 메모: ${variables["#{메모}"]}`,
    "",
    "관리자 페이지에서 확인 후 연락해 주세요.",
  ].join("\n");
}

/**
 * 관리자 전원에게 상담 알림을 카카오 알림톡 + 문자(LMS)로 동시에 보낸다.
 * 설정이 없으면 건너뛴다. 둘 중 하나만 실패하면 나머지는 정상 발송되고,
 * 전부 실패할 때만 예외가 던져지므로 호출부에서 try/catch 할 것.
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
  const smsText = buildSmsText(variables);

  const messages = ADMIN_PHONES.flatMap((to) => [
    // ① 카카오 알림톡. 문자를 별도로 보내므로 실패 시 대체발송(SMS)은 꺼서 중복 수신을 막는다.
    {
      to,
      from: SENDER_PHONE,
      kakaoOptions: {
        pfId: PF_ID!,
        templateId: TEMPLATE_ID!,
        variables,
        disableSms: true,
      },
    },
    // ② 문자(LMS). 발신번호가 솔라피에 등록되어 있어야 발송된다.
    {
      to,
      from: SENDER_PHONE,
      subject: "[성진학원] 새 상담 신청",
      text: smsText,
    },
  ]);

  // 같은 수신자에게 알림톡+문자 두 건을 한 요청으로 보내므로 중복 발송을 허용한다.
  await messageService.send(messages, { allowDuplicates: true });
}
