import { supabase } from "./supabase";

export interface Video {
  id: number;
  youtube_id: string;
  title: string;
  description: string;
  summary: string;
  thumbnail_url: string;
  published_at: string;
  created_at: string;
}

/**
 * 관리자 페이지 전용 삭제. videos 테이블은 anon에게 읽기만 열려 있어(RLS),
 * 로그인 세션 토큰을 실어 서버 라우트(/api/videos/[id])를 통해 지운다.
 */
export async function deleteVideo(id: number): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    console.error("영상 삭제 실패: 로그인 세션이 없습니다.");
    return false;
  }

  const res = await fetch(`/api/videos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error("영상 삭제 실패:", await res.text());
    return false;
  }
  return true;
}

export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("영상 목록 로드 실패:", error);
    return [];
  }
  return data ?? [];
}
