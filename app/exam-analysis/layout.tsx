import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내신분석실",
  description: "중등·고등 내신 분석 PDF 자료를 학교명, 학년, 학기, 과목, 중간·기말고사별로 검색하고 다운로드하세요.",
  alternates: { canonical: "/exam-analysis" },
};

export default function ExamAnalysisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
