export const RESOURCE_BUCKET = "exam-analysis";
export const RESOURCE_LEVELS = ["middle", "high"] as const;
export const RESOURCE_SEMESTERS = ["1", "2"] as const;
export const RESOURCE_SUBJECTS = ["korean", "math", "english", "science"] as const;
export const EXAM_LABELS = { midterm: "중간고사", final: "기말고사" } as const;
export type ExamType = keyof typeof EXAM_LABELS;
export interface ResourceMetadata {
  schoolName: string;
  grade: string;
  exam: ExamType | "";
}

export function validResourceMetadata(value: Record<string, unknown>): boolean {
  return (value.schoolName === undefined || (typeof value.schoolName === "string" && value.schoolName.trim().length <= 50 && !/[\x00-\x1f]/.test(value.schoolName))) &&
    (value.grade === undefined || ["", "1", "2", "3"].includes(value.grade as string)) &&
    (value.exam === undefined || ["", "midterm", "final"].includes(value.exam as string));
}

export type ResourceLevel = (typeof RESOURCE_LEVELS)[number];
export type ResourceSubject = (typeof RESOURCE_SUBJECTS)[number];

export const LEVEL_LABELS: Record<ResourceLevel, string> = {
  middle: "중등",
  high: "고등",
};

export const SUBJECT_LABELS: Record<ResourceSubject, string> = {
  korean: "국어",
  math: "수학",
  english: "영어",
  science: "과학",
};

export function subjectsForLevel(level: ResourceLevel): ResourceSubject[] {
  return level === "middle"
    ? ["korean", "math", "english"]
    : ["korean", "math", "english", "science"];
}

export function validCategory(level: unknown, year: unknown, semester: unknown, subject: unknown): boolean {
  return (
    typeof level === "string" && typeof year === "string" &&
    typeof semester === "string" && typeof subject === "string" &&
    RESOURCE_LEVELS.includes(level as ResourceLevel) &&
    /^20\d{2}$/.test(year) && Number(year) >= 2026 &&
    RESOURCE_SEMESTERS.includes(semester as "1" | "2") &&
    subjectsForLevel(level as ResourceLevel).includes(subject as ResourceSubject)
  );
}

export function resourceFolder(level: string, year: string, semester: string, subject: string): string {
  return `${level}/${year}/${semester}/${subject}`;
}

export function validResourcePath(path: unknown): path is string {
  if (typeof path !== "string") return false;
  const parts = path.split("/");
  return parts.length === 5 &&
    validCategory(parts[0], parts[1], parts[2], parts[3]) &&
    /^[0-9a-f-]{36}__[A-Za-z0-9_-]+$/.test(parts[4]);
}

export function resourceDetailsFromPath(path: string): { name: string; title: string } & ResourceMetadata {
  const emptyMetadata: ResourceMetadata = { schoolName: "", grade: "", exam: "" };
  try {
    // UUID(36자)와 구분자(2자) 뒤의 전체 문자열을 유지한다.
    const encoded = path.split("/").at(-1)?.slice(38) ?? "";
    const decoded = Buffer.from(encoded, "base64url").toString("utf8");
    // 신규 파일은 원래 파일명과 표시 제목을 함께 저장한다.
    // 기존 파일명만 저장된 경로도 그대로 읽을 수 있다.
    if (decoded.startsWith("{")) {
      try {
        const details = JSON.parse(decoded);
        if (typeof details.name === "string" && details.name.toLowerCase().endsWith(".pdf") &&
            typeof details.title === "string" && details.title.trim()) {
          return { name: details.name, title: details.title, ...emptyMetadata,
            ...(validResourceMetadata(details) ? {
              schoolName: details.schoolName?.trim() ?? "", grade: details.grade ?? "", exam: details.exam ?? "",
            } : {}),
          };
        }
      } catch { /* 기존 파일명이 JSON처럼 시작하는 경우 원래 문자열을 사용한다. */ }
    }
    if (decoded.toLowerCase().endsWith(".pdf")) return { name: decoded, title: decoded.replace(/\.pdf$/i, ""), ...emptyMetadata };
  } catch { /* 읽을 수 없는 경로는 기본 제목을 사용한다. */ }
  return { name: "내신분석자료.pdf", title: "내신분석자료", ...emptyMetadata };
}

export function fileNameFromPath(path: string): string {
  return resourceDetailsFromPath(path).name;
}

export function resourceTitleFromPath(path: string): string {
  return resourceDetailsFromPath(path).title;
}

export interface ExamResource extends ResourceMetadata {
  path: string;
  name: string;
  title: string;
  createdAt: string;
  size: number;
}
