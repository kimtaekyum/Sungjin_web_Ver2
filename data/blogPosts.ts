export interface BlogPost {
  title: string;
  date: string; // YYYY-MM-DD (화면 표시용)
  link: string;
  description?: string; // RSS description — 요약용, 화면 표시 X
  publishedAt?: string; // 전체 ISO timestamp — 공지사항 정렬용
}

export const blogPosts: BlogPost[] = [
  {
    title: "성진학원 최신 소식",
    date: "2026-04-13",
    link: "https://blog.naver.com/sja6123/224114034079",
  },
];

export const NAVER_BLOG_URL = "https://blog.naver.com/sja6123";
