import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { fetchVideoById } from "@/lib/youtube";
import { syncVideos } from "@/lib/videoSync";

export const dynamic = "force-dynamic";

/**
 * WebSub(PubSubHubbub) 콜백. 구독 등록은 lib/youtubeSubscribe.ts가 담당한다.
 *
 * - GET  : 허브가 구독을 검증할 때 hub.challenge를 그대로 돌려줘야 한다.
 * - POST : 새 영상이 올라오면 허브가 Atom XML을 보내온다. 서명 검증 후 저장.
 */

function extract(xml: string, tag: string): string {
  const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(xml);
  return match ? match[1].trim() : "";
}

/** 허브가 hub.secret으로 서명한 본문인지 확인 (위조 알림 차단) */
function isValidSignature(body: string, header: string | null, secret: string): boolean {
  if (!header) return false;

  const [algorithm, signature] = header.split("=");
  if (!algorithm || !signature) return false;
  if (!["sha1", "sha256", "sha384", "sha512"].includes(algorithm)) return false;

  const expected = crypto.createHmac(algorithm, secret).update(body).digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(signature, "hex");

  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/** 허브 구독 검증 — hub.challenge를 평문으로 그대로 반환해야 구독이 성립한다. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const topic = searchParams.get("hub.topic");
  const challenge = searchParams.get("hub.challenge");

  if (!challenge || (mode !== "subscribe" && mode !== "unsubscribe")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 우리 채널 피드에 대한 검증 요청일 때만 승인한다.
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId || !topic?.includes(channelId)) {
    console.warn("알 수 없는 topic에 대한 구독 검증 요청:", topic);
    return new NextResponse("Forbidden", { status: 403 });
  }

  console.log(`유튜브 웹훅 구독 검증 승인: mode=${mode}`);
  return new NextResponse(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

/** 새 영상 알림 수신 → 상세 조회 → Claude 요약 → Supabase 저장 */
export async function POST(request: Request) {
  const secret = process.env.YOUTUBE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("YOUTUBE_WEBHOOK_SECRET이 설정되지 않아 웹훅 알림을 거부했습니다.");
    return NextResponse.json(
      { error: "서버에 YOUTUBE_WEBHOOK_SECRET이 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const body = await request.text();
  if (!isValidSignature(body, request.headers.get("x-hub-signature"), secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const entries = body.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  // 영상 삭제 알림(<at:deleted-entry>)에는 yt:videoId가 없어 자연히 걸러진다.
  const videoIds = entries
    .filter((entry) => !channelId || extract(entry, "yt:channelId") === channelId)
    .map((entry) => extract(entry, "yt:videoId"))
    .filter(Boolean);

  if (videoIds.length === 0) {
    return NextResponse.json({ received: true, imported: 0, note: "처리할 영상 없음" });
  }

  const videos = [];
  for (const id of videoIds) {
    const video = await fetchVideoById(id);
    if (video) videos.push(video);
  }

  const result = await syncVideos(videos);
  console.log("유튜브 웹훅 동기화 결과:", result);

  return NextResponse.json({ received: true, ...result });
}
