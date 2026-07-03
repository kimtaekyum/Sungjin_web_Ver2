import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { sendConsultationAlimtalk } from "@/lib/alimtalk";
import { GRADES, levelFromGrade } from "@/lib/schools";

export const dynamic = "force-dynamic";

type Body = {
  parentName?: unknown;
  phone?: unknown;
  grade?: unknown;
  school?: unknown;
  subjects?: unknown;
  preferredDate?: unknown;
  preferredTime?: unknown;
  memo?: unknown;
  turnstileToken?: unknown;
};

const ALLOWED_SUBJECTS = ["국어", "영어", "수학", "과학"] as const;
const SCHOOL_MAX_LEN = 30;

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

  const gradeDetailRaw = typeof body.grade === "string" ? body.grade : "";
  if (!GRADES.includes(gradeDetailRaw)) {
    return NextResponse.json(
      { error: "학년을 선택해주세요." },
      { status: 400 }
    );
  }
  const gradeDetail = gradeDetailRaw;
  // 기존 grade 컬럼(초등/중등/고등)에 넣을 학교급을 상세 학년에서 파생한다.
  const level = levelFromGrade(gradeDetail);
  if (!level) {
    return NextResponse.json({ error: "학년을 선택해주세요." }, { status: 400 });
  }

  // 학교: 목록 선택값 또는 "기타" 직접입력값. 자유 입력이라 길이만 제한(없으면 null).
  const schoolRaw = typeof body.school === "string" ? body.school.trim() : "";
  const school = schoolRaw ? schoolRaw.slice(0, SCHOOL_MAX_LEN) : null;

  const subjects = Array.isArray(body.subjects)
    ? body.subjects
        .filter((s): s is string => typeof s === "string")
        .filter((s) => (ALLOWED_SUBJECTS as readonly string[]).includes(s))
    : [];

  // ----- 상담 희망 날짜 (필수) -----
  // 당일 신청 허용(일요일 포함), 지난 날짜는 거부. 서버는 UTC이므로 KST로 보정해 비교한다.
  const preferredDateRaw =
    typeof body.preferredDate === "string" ? body.preferredDate.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDateRaw)) {
    return NextResponse.json(
      { error: "상담 희망 날짜를 선택해주세요." },
      { status: 400 }
    );
  }
  const [py, pmon, pday] = preferredDateRaw.split("-").map(Number);
  const dateUtc = new Date(Date.UTC(py, pmon - 1, pday));
  const isRealDate =
    dateUtc.getUTCFullYear() === py &&
    dateUtc.getUTCMonth() === pmon - 1 &&
    dateUtc.getUTCDate() === pday;
  if (!isRealDate) {
    return NextResponse.json(
      { error: "상담 희망 날짜가 올바르지 않습니다." },
      { status: 400 }
    );
  }
  const todayKst = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (preferredDateRaw < todayKst) {
    return NextResponse.json(
      { error: "지난 날짜는 선택할 수 없습니다." },
      { status: 400 }
    );
  }
  const preferredDate = preferredDateRaw;

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
    grade: level, // 기존 컬럼: 학교급(초등/중등/고등)
    grade_detail: gradeDetail, // 신규: 상세 학년(예: 초등학교 2학년)
    school, // 신규: 학교명
    subjects,
    preferred_date: preferredDate,
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

  // 상담 저장 성공 후 관리자(원장님)에게 카카오 알림톡 발송.
  // 발송이 실패해도 상담 저장은 이미 끝났으므로 사용자 응답에는 영향 주지 않는다.
  try {
    await sendConsultationAlimtalk({
      parentName: parentNameRaw,
      phoneDisplay,
      gradeDetail,
      school,
      subjects,
      preferredDate,
      preferredTime,
      memo,
    });
  } catch (alimtalkError) {
    console.error("알림톡 발송 실패(상담은 정상 저장됨):", alimtalkError);
  }

  return NextResponse.json({ ok: true });
}
