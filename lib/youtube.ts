export interface YoutubeVideo {
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string; // ISO
}

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface Snippet {
  title?: unknown;
  description?: unknown;
  publishedAt?: unknown;
  thumbnails?: Record<string, { url?: string }>;
  resourceId?: { videoId?: string };
}

function pickThumbnail(thumbnails?: Record<string, { url?: string }>): string {
  return (
    thumbnails?.maxres?.url ??
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    ""
  );
}

function toVideo(snippet: Snippet, youtubeId: string): YoutubeVideo {
  return {
    youtubeId,
    title: String(snippet.title ?? ""),
    description: String(snippet.description ?? ""),
    thumbnailUrl: pickThumbnail(snippet.thumbnails),
    publishedAt: String(snippet.publishedAt ?? ""),
  };
}

async function getUploadsPlaylistId(apiKey: string, channelId: string): Promise<string> {
  const url = `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`채널 조회 실패: ${res.status}`);

  const json = await res.json();
  const uploadsId = json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error("업로드 재생목록을 찾을 수 없습니다. YOUTUBE_CHANNEL_ID를 확인하세요.");
  return uploadsId;
}

/**
 * 채널의 업로드 재생목록에서 최신 영상을 가져온다.
 * API 키/채널 ID가 없으면 빈 배열을 반환한다 (sync-blog의 fallback 패턴과 동일한 안전장치).
 */
export async function fetchLatestVideos(maxResults = 10): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.warn("YOUTUBE_API_KEY 또는 YOUTUBE_CHANNEL_ID가 설정되지 않았습니다.");
    return [];
  }

  try {
    const uploadsPlaylistId = await getUploadsPlaylistId(apiKey, channelId);

    const url = `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`업로드 목록 조회 실패: ${res.status}`);

    const json = await res.json();
    const items: unknown[] = json.items ?? [];

    return items
      .map((item): YoutubeVideo | null => {
        const snippet = (item as { snippet?: Snippet }).snippet;
        const youtubeId = snippet?.resourceId?.videoId;
        if (!snippet || !youtubeId) return null;
        return toVideo(snippet, youtubeId);
      })
      .filter((v): v is YoutubeVideo => v !== null && !!v.title);
  } catch (err) {
    console.error("유튜브 영상 목록 로드 실패:", err);
    return [];
  }
}
