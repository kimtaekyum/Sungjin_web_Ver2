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
