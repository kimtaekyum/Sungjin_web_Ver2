import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "강의영상 | 성진학원 - 국어·영어·수학 개념 강의",
  description:
    "성진학원 강의 영상으로 배운 내용을 복습하세요. 국어·영어·수학 개념 강의를 홈페이지에서 바로 볼 수 있습니다.",
  alternates: { canonical: "/videos" },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
