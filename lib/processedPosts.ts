import { supabase } from "./supabase";

export async function getProcessedIds(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("processed_blog_posts")
    .select("id");

  if (error) {
    console.error("processed_blog_posts 조회 실패:", error);
    return new Set();
  }
  return new Set((data ?? []).map((row) => row.id as string));
}

export async function markProcessed(
  id: string,
  title: string,
  noticeId: number | null
): Promise<boolean> {
  const { error } = await supabase
    .from("processed_blog_posts")
    .insert({ id, title, notice_id: noticeId });

  if (error) {
    console.error("processed_blog_posts 기록 실패:", error);
    return false;
  }
  return true;
}
