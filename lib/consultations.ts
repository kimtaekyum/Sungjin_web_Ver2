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

/**
 * 아래 헬퍼들은 관리자(로그인 세션) 브라우저에서 호출된다.
 * RLS: authenticated 역할만 SELECT/UPDATE/DELETE 가능.
 * anon INSERT는 /api/consultations 라우트에서 service_role로 직접 처리한다.
 */

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
