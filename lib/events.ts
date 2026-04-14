import { supabase } from "./supabase";
import type { AcademyEvent } from "@/data/events";

interface EventRow {
  id: number;
  title: string;
  start_date: string; // YYYY-MM-DD
  end_date: string | null;
  created_at: string;
}

function rowToEvent(row: EventRow): AcademyEvent {
  return {
    id: String(row.id),
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
  };
}

export async function getEvents(): Promise<AcademyEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) {
    console.error("일정 로드 실패:", error);
    return [];
  }
  return (data ?? []).map(rowToEvent);
}

export async function addEvent(event: {
  title: string;
  startDate: string;
  endDate?: string;
}): Promise<AcademyEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: event.title,
      start_date: event.startDate,
      end_date: event.endDate || null,
    })
    .select()
    .single();

  if (error) {
    console.error("일정 등록 실패:", error);
    return null;
  }
  return rowToEvent(data);
}

export async function updateEvent(
  id: string,
  updates: { title?: string; startDate?: string; endDate?: string | null }
): Promise<boolean> {
  const payload: Partial<EventRow> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.startDate !== undefined) payload.start_date = updates.startDate;
  if (updates.endDate !== undefined) payload.end_date = updates.endDate || null;

  const { error } = await supabase.from("events").update(payload).eq("id", Number(id));

  if (error) {
    console.error("일정 수정 실패:", error);
    return false;
  }
  return true;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase.from("events").delete().eq("id", Number(id));

  if (error) {
    console.error("일정 삭제 실패:", error);
    return false;
  }
  return true;
}
