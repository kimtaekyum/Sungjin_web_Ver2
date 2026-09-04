import { NextResponse } from "next/server";
import { fetchLatestVideos } from "@/lib/youtube";
import { summarizeVideo } from "@/lib/summarizeVideo";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

interface SyncResult {
  imported: number;
  skipped: number;
  total: number;
  errors: string[];
}

async function getExistingYoutubeIds(): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin.from("videos").select("youtube_id");
  if (error) {
    console.error("videos 조회 실패:", error);
    return new Set();
  }
  return new Set((data ?? []).map((row) => row.youtube_id as string));
}

/** 동기화 핵심 로직 — POST(수동)·GET(cron) 양쪽에서 공유 (sync-blog와 동일 패턴) */
async function runSync(): Promise<SyncResult> {
  const videos = await fetchLatestVideos();
  const existingIds = await getExistingYoutubeIds();
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

/** Vercel Cron(또는 외부 스케줄러) 자동 동기화 — Bearer CRON_SECRET 인증 (sync-blog와 동일 CRON_SECRET 재사용) */
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
