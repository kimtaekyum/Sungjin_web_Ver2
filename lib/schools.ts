/**
 * 상담 폼의 학년·학교 선택 데이터.
 *
 * - 학년: 초등학교 1학년 ~ 고등학교 3학년 (12개)
 * - 학교: 학년에서 정해지는 학교급(초/중/고)에 따라 신월동·양천구 인근 학교 목록 노출
 * - 목록에 없으면 "기타" 선택 후 직접 입력
 */

export const SCHOOL_LEVELS = ["초등", "중등", "고등"] as const;
export type SchoolLevel = (typeof SCHOOL_LEVELS)[number];

/** 학년 선택 목록 (초1 ~ 고3) */
export const GRADES: readonly string[] = [
  "초등학교 1학년",
  "초등학교 2학년",
  "초등학교 3학년",
  "초등학교 4학년",
  "초등학교 5학년",
  "초등학교 6학년",
  "중학교 1학년",
  "중학교 2학년",
  "중학교 3학년",
  "고등학교 1학년",
  "고등학교 2학년",
  "고등학교 3학년",
] as const;

/** 목록에 없는 학교를 직접 입력할 때 쓰는 값 */
export const SCHOOL_ETC = "기타";

/** 학교급별 인근 학교 목록 (가나다순). 원장님이 확정한 목록. */
export const SCHOOLS_BY_LEVEL: Record<SchoolLevel, readonly string[]> = {
  초등: [
    "강서초",
    "강월초",
    "신강초",
    "신남초",
    "신은초",
    "양강초",
    "양동초",
    "장수초",
    "지향초",
  ],
  중등: [
    "강신중",
    "금옥중",
    "신남중",
    "신서중",
    "양강중",
    "양서중",
    "양천중",
    "오류중",
  ],
  고등: ["광영고", "목동고", "신서고", "양천고", "진명여고"],
};

/** 학년 문자열에서 학교급(초/중/고)을 판별한다. 유효하지 않으면 null. */
export function levelFromGrade(grade: string): SchoolLevel | null {
  if (grade.startsWith("초등학교")) return "초등";
  if (grade.startsWith("중학교")) return "중등";
  if (grade.startsWith("고등학교")) return "고등";
  return null;
}

/** 해당 학년에서 고를 수 있는 학교 목록 (인근 학교 + 기타). 학년 미선택이면 빈 배열. */
export function schoolOptionsForGrade(grade: string): string[] {
  const level = levelFromGrade(grade);
  if (!level) return [];
  return [...SCHOOLS_BY_LEVEL[level], SCHOOL_ETC];
}
