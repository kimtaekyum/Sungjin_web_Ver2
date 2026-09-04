import { summarizeVideo } from "./summarizeVideo";
import { supabaseAdmin } from "./supabaseServer";
import type { YoutubeVideo } from "./youtube";

export interface SyncResult {
  imported: number;
  updated: number;
  skipped: number;
  total: number;
  errors: string[];
}

interface ExistingVideo {
  id: number;
  youtube_id: string;
  title: string;
  thumbnail_url: string | null;
  description: string | null;
}

async function getExistingVideos(youtubeIds: string[]): Promise<Map<string, ExistingVideo>> {
  if (youtubeIds.length === 0) return new Map();

  const { data, error } = await supabaseAdmin
    .from("videos")
    .select("id, youtube_id, title, thumbnail_url, description")
    .in("youtube_id", youtubeIds);

  if (error) {
    console.error("videos 조회 실패:", error);
    return new Map();
  }
  return new Map((data ?? []).map((row) => [row.youtube_id as string, row as ExistingVideo]));
}

/**
 * 유튜브 영상을 videos 테이블에 반영한다.
 * 수동 동기화(app/api/sync-youtube)와 실시간 웹훅(app/api/youtube-webhook)이 공유한다.
 *
 * - 처음 보는 영상: Claude로 소개 문구를 만들어 새로 저장
 * - 이미 있는 영상: 제목·썸네일·설명만 최신으로 갱신
 *
 * 소개 문구(summary)는 갱신하지 않는다. 관리자가 손으로 다듬은 문구가 유튜브 쪽
 * 사소한 수정 때문에 날아가면 안 되기 때문. 문구를 새로 뽑고 싶으면 관리자 페이지에서
 * 해당 영상을 지우고 다시 동기화하면 된다.
 *
 * published_at도 갱신하지 않는다. 목록 정렬 기준이라 값이 바뀌면 노출 순서가 흔들린다.
 */
export async function syncVideos(videos: YoutubeVideo[]): Promise<SyncResult> {
  const existingMap = await getExistingVideos(videos.map((v) => v.youtubeId));

  const errors: string[] = [];
  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const video of videos) {
    try {
      const existing = existingMap.get(video.youtubeId);

      if (existing) {
        const hasChanged =
          existing.title !== video.title ||
          (existing.thumbnail_url ?? "") !== video.thumbnailUrl ||
          (existing.description ?? "") !== video.description;

        if (!hasChanged) {
          skipped += 1;
          continue;
        }

        const { error } = await supabaseAdmin
          .from("videos")
          .update({
            title: video.title,
            thumbnail_url: video.thumbnailUrl,
            description: video.description,
          })
          .eq("id", existing.id);

        if (error) {
          errors.push(`${video.title}: ${error.message}`);
          continue;
        }

        updated += 1;
        continue;
      }

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
    updated,
    skipped,
    total: videos.length,
    errors,
  };
}
