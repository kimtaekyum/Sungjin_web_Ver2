export interface AdmissionResult {
  university: string;
  department: string;
}

export const admissionResults: AdmissionResult[] = [
  { university: "서울대", department: "약대" },
  { university: "포항공대", department: "" },
  { university: "연세대", department: "지능형 반도체" },
  { university: "고려대", department: "데이터과학과" },
  { university: "성균관대", department: "소프트웨어학과" },
  { university: "한양대", department: "데이터 사이언스 학부" },
  { university: "한양대", department: "생명공학과" },
  { university: "동국대", department: "경찰행정학부" },
  { university: "건국대", department: "자유전공학부" },
  { university: "건국대", department: "물리학과" },
  { university: "인하대", department: "전기전자공학부" },
  { university: "원광대", department: "국방기술학과" },
  { university: "전북대", department: "사학과" },
];

/**
 * 대학별 로고 설정 (public/images/대학로고/ 기준)
 * - path: 파일 경로
 * - scale: 로고 이미지 내부 여백 차이를 보정하는 배율 (기본 1)
 *   원본 이미지마다 로고 mark 주변 공간이 달라서 object-contain만으로는
 *   시각적 크기가 안 맞음. 서울대(1.0)를 기준으로 다른 로고를 보정.
 *
 * 매핑에 없는 대학은 로고 없이 렌더링됨 (깔끔한 폴백)
 */
export type UniversityLogo = {
  path: string;
  scale?: number;
};

export const UNIVERSITY_LOGOS: Record<string, UniversityLogo> = {
  "서울대": { path: "/images/대학로고/서울대.png", scale: 0.8 },
  "포항공대": { path: "/images/대학로고/포항공대.png", scale: 0.8 },
  "연세대": { path: "/images/대학로고/연세대.jpg", scale: 1.5 },
  "고려대": { path: "/images/대학로고/고려대.gif", scale: 0.85 },
  "성균관대": { path: "/images/대학로고/성균관대.jpg", scale: 1.35 },
  "한양대": { path: "/images/대학로고/한양대.svg", scale: 0.8 },
  "동국대": { path: "/images/대학로고/동국대.jpg", scale: 0.8 },
  "건국대": { path: "/images/대학로고/건국대.jpg", scale: 0.8 },
  "인하대": { path: "/images/대학로고/인하대.jpg", scale: 1.3 },
  "원광대": { path: "/images/대학로고/원광대.jpg", scale: 0.8 },
  "전북대": { path: "/images/대학로고/전북대.png" },
};

export interface ScoreImprovement {
  subject: string;
  before: string;
  after: string;
}

export const scoreImprovements: ScoreImprovement[] = [
  { subject: "수학", before: "31점", after: "71점" },
  { subject: "수학", before: "평균", after: "100점" },
  { subject: "국어", before: "70점대", after: "100점" },
  { subject: "국어", before: "90점대", after: "100점" },
  { subject: "영어", before: "80점대", after: "90점" },
  { subject: "영어", before: "50점대", after: "80점" },
];
