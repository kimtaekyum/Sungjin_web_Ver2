import { NextResponse } from "next/server";
import { subscribeToChannelFeed } from "@/lib/youtubeSubscribe";

export const dynamic = "force-dynamic";

/**
 * WebSub 구독 등록·갱신. 구독은 며칠 뒤 만료되므로 Vercel Cron이 매일 재구독한다.
 * 인증 방식은 sync-blog·sync-youtube와 동일하다.
 */

/** 최초 구독 / 수동 재구독 — body.secret 인증. mode: "unsubscribe"로 해지도 가능. */
export async function POST(request: Request) {
  let body: { secret?: string; mode?: string };
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

  const mode = body.mode === "unsubscribe" ? "unsubscribe" : "subscribe";

  try {
    const result = await subscribeToChannelFeed(mode);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** Vercel Cron 자동 갱신 — Bearer CRON_SECRET 인증 */
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

  try {
    const result = await subscribeToChannelFeed("subscribe");
    console.log("유튜브 웹훅 구독 갱신:", result);
    return NextResponse.json({ source: "cron", ...result }, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("유튜브 웹훅 구독 갱신 실패:", msg);
    return NextResponse.json({ source: "cron", error: msg }, { status: 500 });
  }
}
