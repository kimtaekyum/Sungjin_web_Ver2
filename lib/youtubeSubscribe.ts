/**
 * YouTube 채널 피드를 WebSub(PubSubHubbub) 허브에 구독/해지한다.
 *
 * 구독해두면 채널에 새 영상이 올라올 때 허브가 우리 콜백(/api/youtube-webhook)으로
 * 알림을 POST해준다. 구독은 lease_seconds 후 만료되므로 Vercel Cron이 매일 재구독한다.
 */

const HUB_URL = "https://pubsubhubbub.appspot.com/subscribe";
/** 허브에 요청하는 구독 유효기간(10일). 허브가 더 짧게 줄 수 있어 매일 갱신한다. */
const LEASE_SECONDS = 864000;

export function getChannelFeedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

export interface SubscribeResult {
  ok: boolean;
  status: number;
  mode: "subscribe" | "unsubscribe";
  topic: string;
  callback: string;
  message: string;
}

export async function subscribeToChannelFeed(
  mode: "subscribe" | "unsubscribe" = "subscribe"
): Promise<SubscribeResult> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.YOUTUBE_WEBHOOK_SECRET;

  if (!channelId) {
    throw new Error("YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.");
  }
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL이 설정되지 않았습니다.");
  }
  // 허브는 공개 https 주소로만 알림을 보낼 수 있다 (localhost 불가).
  if (!siteUrl.startsWith("https://")) {
    throw new Error(
      `콜백 주소는 https여야 합니다. 현재 NEXT_PUBLIC_SITE_URL: ${siteUrl} (로컬에서는 구독할 수 없습니다)`
    );
  }
  if (!secret) {
    throw new Error(
      "YOUTUBE_WEBHOOK_SECRET이 설정되지 않았습니다. 웹훅 서명 검증에 쓰이므로 반드시 필요합니다."
    );
  }

  const topic = getChannelFeedUrl(channelId);
  const callback = `${siteUrl.replace(/\/$/, "")}/api/youtube-webhook`;

  const params = new URLSearchParams({
    "hub.mode": mode,
    "hub.topic": topic,
    "hub.callback": callback,
    "hub.verify": "async",
    "hub.secret": secret,
    "hub.lease_seconds": String(LEASE_SECONDS),
  });

  const res = await fetch(HUB_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  // 허브는 검증을 비동기로 처리하므로 보통 202 Accepted를 준다.
  const message = await res.text().catch(() => "");

  return {
    ok: res.ok,
    status: res.status,
    mode,
    topic,
    callback,
    message: message.slice(0, 300),
  };
}
