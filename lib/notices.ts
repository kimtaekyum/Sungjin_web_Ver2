import { supabase } from "./supabase";

export interface Notice {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  created_at: string;
}

export async function getNotices(): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("공지사항 로드 실패:", error);
    throw new Error("공지사항 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
  }
  return data ?? [];
}

export async function addNotice(notice: {
  title: string;
  content: string;
  pinned: boolean;
  created_at?: string; // 명시하면 DB default(now()) 대신 사용 (블로그 sync용)
}): Promise<Notice | null> {
  const { data, error } = await supabase
    .from("notices")
    .insert(notice)
    .select()
    .single();

  if (error) {
    console.error("공지사항 등록 실패:", error);
    return null;
  }
  return data;
}

export async function updateNotice(id: number, updates: Partial<{ title: string; content: string; pinned: boolean }>): Promise<boolean> {
  const { error } = await supabase
    .from("notices")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("공지사항 수정 실패:", error);
    return false;
  }
  return true;
}

export async function deleteNotice(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("notices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("공지사항 삭제 실패:", error);
    return false;
  }
  return true;
}
