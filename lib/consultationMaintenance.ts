import { supabaseAdmin } from "./supabaseServer";

const AUTO_CONTACT_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** 접수 후 7일 이상 지난 신규 신청만 원자적으로 변경한다. */
export async function completeStaleConsultations(now = new Date()) {
  const cutoff = new Date(now.getTime() - AUTO_CONTACT_AFTER_MS).toISOString();
  const { count, error } = await supabaseAdmin
    .from("consultations")
    .update({ status: "contacted" }, { count: "exact" })
    .eq("status", "new")
    .lte("created_at", cutoff);

  if (error) throw error;
  return { updated: count ?? 0, cutoff };
}
