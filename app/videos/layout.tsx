import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "영상 | 성진학원 - 학원 소식 및 안내",
  description: "성진학원 유튜브 채널의 최신 영상을 확인하세요.",
  alternates: { canonical: "/videos" },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
