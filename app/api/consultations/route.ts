import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Body = {
  parentName?: unknown;
  phone?: unknown;
  grade?: unknown;
  subjects?: unknown;
  preferredTime?: unknown;
  memo?: unknown;
  turnstileToken?: unknown;
};

const ALLOWED_GRADES = ["초등", "중등", "고등"] as const;
type Grade = (typeof ALLOWED_GRADES)[number];
const ALLOWED_SUBJECTS = ["국어", "영어", "수학", "과학"] as const;

const RATE_LIMIT_WINDOW_SEC = 300; // 5분
const RATE_LIMIT_MAX = 3;

/** 010-1234-5678 → 01012345678. 11자리 010 번호만 통과. */
function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!/^010\d{8}$/.test(digits)) return null;
  return digits;
}

function formatPhoneDisplay(digits: string): string {
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/**
 * Rate-limit: RLS로 anon SELECT가 막혀 있으므로 service_role로 조회한다.
 * 같은 전화번호(정규화)로 최근 windowSec 초 내 제출 건수.
 */
async function countRecentByPhone(
  phone: string,
  windowSec: number
): Promise<number> {
  const since = new Date(Date.now() - windowSec * 1000).toISOString();
  const { count, error } = await supabaseAdmin
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

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  // ----- 0. Turnstile 검증 (키가 설정된 경우에만) -----
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!token) {
      return NextResponse.json({ error: "보안 인증을 완료해주세요." }, { status: 400 });
    }
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(token)}`,
    });
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      return NextResponse.json({ error: "보안 인증에 실패했습니다. 다시 시도해주세요." }, { status: 403 });
    }
  }

  // ----- 1. 검증 -----
  const parentNameRaw = typeof body.parentName === "string" ? body.parentName.trim() : "";
  if (parentNameRaw.length < 1 || parentNameRaw.length > 20) {
    return NextResponse.json(
      { error: "학부모명은 1~20자로 입력해주세요." },
      { status: 400 }
    );
  }

  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  const normalizedPhone = normalizePhone(phoneRaw);
  if (!normalizedPhone) {
    return NextResponse.json(
      { error: "휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)" },
      { status: 400 }
    );
  }
  const phoneDisplay = formatPhoneDisplay(normalizedPhone);

  const gradeRaw = typeof body.grade === "string" ? body.grade : "";
  if (!ALLOWED_GRADES.includes(gradeRaw as Grade)) {
    return NextResponse.json(
      { error: "학년을 선택해주세요." },
      { status: 400 }
    );
  }
  const grade = gradeRaw as Grade;

  const subjects = Array.isArray(body.subjects)
    ? body.subjects
        .filter((s): s is string => typeof s === "string")
        .filter((s) => (ALLOWED_SUBJECTS as readonly string[]).includes(s))
    : [];

  const preferredTimeRaw =
    typeof body.preferredTime === "string" ? body.preferredTime.trim() : "";
  const preferredTime = preferredTimeRaw.slice(0, 100) || null;

  const memoRaw = typeof body.memo === "string" ? body.memo.trim() : "";
  const memo = memoRaw.slice(0, 1000) || null;

  // ----- 2. Rate limit (전화번호 기준) -----
  const recentCount = await countRecentByPhone(normalizedPhone, RATE_LIMIT_WINDOW_SEC);
  if (recentCount >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      {
        error:
          "같은 번호로 너무 자주 신청하셨습니다. 잠시 후 다시 시도해주세요. (또는 직접 전화 주세요: 02-2693-6123)",
      },
      { status: 429 }
    );
  }

  // ----- 3. 저장 -----
  // 주의: `.select().single()`을 붙이면 INSERT 후 RETURNING으로 행을 다시 읽는데,
  // 그때 SELECT RLS 정책이 평가된다. SELECT 정책은 authenticated 전용이므로
  // anon/service_role 경로에서 `new row violates RLS` 에러로 둔갑할 수 있다.
  // id는 응답에서 쓰이지 않으므로 RETURNING을 생략한다.
  const { error } = await supabaseAdmin.from("consultations").insert({
    parent_name: parentNameRaw,
    phone: normalizedPhone,
    phone_display: phoneDisplay,
    grade,
    subjects,
    preferred_time: preferredTime,
    memo,
  });

  if (error) {
    console.error("상담 신청 저장 실패:", error);
    return NextResponse.json(
      { error: "상담 신청 저장에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }

  // Phase 4에서 이 지점에 알림톡 발송 로직 추가
  return NextResponse.json({ ok: true });
}
