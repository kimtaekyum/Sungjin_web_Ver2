import { NextResponse } from "next/server";
import { fetchLatestVideos } from "@/lib/youtube";
import { syncVideos } from "@/lib/videoSync";

export const dynamic = "force-dynamic";

/**
 * 유튜브 영상 수동 전체 동기화(백필). 평소 새 영상은 웹훅(app/api/youtube-webhook)이
 * 실시간으로 처리하고, 이 라우트는 웹훅이 놓친 영상이나 과거 영상을 채울 때 쓴다.
 * 인증 방식은 sync-blog와 동일하다.
 */
async function runSync() {
  return syncVideos(await fetchLatestVideos());
}

/** 관리자 수동 동기화 — body.secret 인증 (sync-blog와 동일 SYNC_SECRET 재사용) */
export async function POST(request: Request) {
  let body: { secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const expectedSecret = process.env.SYNC_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: "서버에 SYNC_SECRET이 설정되지 않았습니다." },
      { status: 500 }
    );
  }
  if (body.secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runSync();
  return NextResponse.json(result);
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

  const result = await runSync();
  return NextResponse.json({ source: "cron", ...result });
}
