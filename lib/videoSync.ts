import { summarizeVideo } from "./summarizeVideo";
import { supabaseAdmin } from "./supabaseServer";
import type { YoutubeVideo } from "./youtube";

export interface SyncResult {
  imported: number;
  skipped: number;
  total: number;
  errors: string[];
}

async function getExistingYoutubeIds(youtubeIds: string[]): Promise<Set<string>> {
  if (youtubeIds.length === 0) return new Set();

  const { data, error } = await supabaseAdmin
    .from("videos")
    .select("youtube_id")
    .in("youtube_id", youtubeIds);

  if (error) {
    console.error("videos 조회 실패:", error);
    return new Set();
  }
  return new Set((data ?? []).map((row) => row.youtube_id as string));
}

/**
 * 아직 저장되지 않은 영상만 Claude로 요약해 videos 테이블에 넣는다.
 * 수동 동기화(app/api/sync-youtube)와 실시간 웹훅(app/api/youtube-webhook)이 공유한다.
 *
 * 웹훅은 영상 제목·설명이 수정될 때도 알림을 보내므로, 이미 있는 youtube_id는
 * 건너뛴다(= 요약 문구를 나중에 손으로 고쳐도 덮어쓰이지 않는다).
 */
export async function syncVideos(videos: YoutubeVideo[]): Promise<SyncResult> {
  const existingIds = await getExistingYoutubeIds(videos.map((v) => v.youtubeId));
  const newVideos = videos.filter((v) => !existingIds.has(v.youtubeId));

  const errors: string[] = [];
  let imported = 0;

  for (const video of newVideos) {
    try {
      const summary = await summarizeVideo(video.title, video.description);

      const { error } = await supabaseAdmin.from("videos").insert({
        youtube_id: video.youtubeId,
        title: video.title,
        description: video.description,
        summary,
        thumbnail_url: video.thumbnailUrl,
        published_at: video.publishedAt,
      });

      if (error) {
        errors.push(`${video.title}: ${error.message}`);
        continue;
      }

      imported += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${video.title}: ${msg}`);
    }
  }

  return {
    imported,
    skipped: videos.length - newVideos.length,
    total: videos.length,
    errors,
  };
}
