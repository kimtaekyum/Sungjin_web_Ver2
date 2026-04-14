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
