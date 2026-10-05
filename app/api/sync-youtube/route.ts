import { NextResponse } from "next/server";
import { authenticated } from "@/lib/adminAuth";
import { fetchLatestVideos } from "@/lib/youtube";
import { syncVideos } from "@/lib/videoSync";

export const dynamic = "force-dynamic";

/**
 * 유튜브 영상 동기화. 관리자 페이지의 "영상 동기화" 버튼이 호출한다.
 * 인증 방식은 sync-blog와 동일하다.
 */
async function runSync() {
  return syncVideos(await fetchLatestVideos());
}

/** 관리자 수동 동기화 — Supabase 로그인 세션 인증 */
export async function POST(request: Request) {
  if (!(await authenticated(request))) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  return respondToSync();
}

async function respondToSync(source?: "cron") {
  try {
    const result = await runSync();
    return NextResponse.json({ ...(source ? { source } : {}), ...result });
  } catch (error) {
    console.error("동기화 실패:", error);
    return NextResponse.json({ error: "동기화를 완료하지 못했습니다. 잠시 후 다시 시도해주세요." }, { status: 503 });
  }
}

/** 외부 스케줄러용 — Bearer CRON_SECRET 인증 (sync-blog와 동일 CRON_SECRET 재사용) */
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "서버에 CRON_SECRET이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return respondToSync("cron");
}
