import { supabase } from "./supabase";

export type ConsultationStatus = "new" | "contacted" | "enrolled" | "declined";
export type AlimtalkStatus = "pending" | "sent" | "failed";

export interface Consultation {
  id: number;
  parent_name: string;
  phone: string;           // 01012345678 (정규화)
  phone_display: string;   // 010-1234-5678 (원본)
  grade: "초등" | "중등" | "고등";
  subjects: string[];
  preferred_time: string | null;
  memo: string | null;
  status: ConsultationStatus;
  alimtalk_status: AlimtalkStatus;
  alimtalk_sent_at: string | null;
  created_at: string;
}

export async function getConsultations(): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("상담 신청 로드 실패:", error);
    return [];
  }
  return data ?? [];
}

export async function addConsultation(consultation: {
  parent_name: string;
  phone: string;
  phone_display: string;
  grade: "초등" | "중등" | "고등";
  subjects?: string[];
  preferred_time?: string | null;
  memo?: string | null;
}): Promise<Consultation | null> {
  const { data, error } = await supabase
    .from("consultations")
    .insert({
      parent_name: consultation.parent_name,
      phone: consultation.phone,
      phone_display: consultation.phone_display,
      grade: consultation.grade,
      subjects: consultation.subjects ?? [],
      preferred_time: consultation.preferred_time ?? null,
      memo: consultation.memo ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("상담 신청 등록 실패:", error);
    return null;
  }
  return data;
}

export async function updateConsultationStatus(
  id: number,
  status: ConsultationStatus
): Promise<boolean> {
  const { error } = await supabase
    .from("consultations")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("상담 상태 변경 실패:", error);
    return false;
  }
  return true;
}

export async function deleteConsultation(id: number): Promise<boolean> {
  const { error } = await supabase
    .from("consultations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("상담 삭제 실패:", error);
    return false;
  }
  return true;
}

/**
 * Rate-limit 헬퍼: 같은 전화번호(정규화된 값)로 최근 windowSec 초 내에
 * 몇 건 제출됐는지 센다. 봇/중복 클릭 방어용.
 */
export async function countRecentByPhone(
  phone: string,
  windowSec: number
): Promise<number> {
  const since = new Date(Date.now() - windowSec * 1000).toISOString();
  const { count, error } = await supabase
    .from("consultations")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", since);

  if (error) {
    console.error("rate-limit 조회 실패:", error);
    return 0;
  }
  return count ?? 0;
}
