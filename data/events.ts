export interface AcademyEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export const events: AcademyEvent[] = [
  { id: "1", title: "중간고사 대비 특강", startDate: "2026-04-20", endDate: "2026-04-25" },
  { id: "2", title: "학부모 상담 주간", startDate: "2026-05-11", endDate: "2026-05-16" },
  { id: "3", title: "기말고사 대비 특강", startDate: "2026-06-15", endDate: "2026-06-20" },
];
