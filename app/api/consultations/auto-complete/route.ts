import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { completeStaleConsultations } from "@/lib/consultationMaintenance";

export const dynamic = "force-dynamic";

async function runMaintenance() {
  try {
    const result = await completeStaleConsultations();
    return NextResponse.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("상담 신청 자동 연락 완료 처리 실패:", error);
    return NextResponse.json({ error: "상담 신청 자동 처리를 완료하지 못했습니다." }, { status: 500 });
  }
}

/** Vercel Cron: 매일 한국 시간 자정에 실행한다. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "자동 처리 설정이 필요합니다." }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  return runMaintenance();
}

/** 관리자 목록을 읽기 전에 서버 시각을 기준으로 상태를 정리한다. */
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  return runMaintenance();
}
