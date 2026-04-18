import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항 | 성진학원 - 학원 소식 및 안내",
  description:
    "성진학원 공지사항. 수업 일정, 학원 소식, 입시 정보 등 최신 안내를 확인하세요.",
  alternates: { canonical: "/notices" },
};

export default function NoticesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
