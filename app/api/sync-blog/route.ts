import { NextResponse } from "next/server";
import { fetchLatestBlogPosts } from "@/lib/blogFeed";
import { getProcessedIds, markProcessed } from "@/lib/processedPosts";
import { summarizeBlogPost } from "@/lib/summarize";
import { addNotice } from "@/lib/notices";

export const dynamic = "force-dynamic";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

interface SyncResult {
  imported: number;
  skipped: number;
  total: number;
  errors: string[];
}

/** 동기화 핵심 로직 — POST(수동)·GET(cron) 양쪽에서 공유 */
async function runSync(): Promise<SyncResult> {
  const posts = await fetchLatestBlogPosts({ fresh: true });
  const processedIds = await getProcessedIds();
  const newPosts = posts.filter((p) => !processedIds.has(p.link));

  const errors: string[] = [];
  let imported = 0;

  for (const post of newPosts) {
    try {
      const cleanContent = post.description ? stripHtml(post.description) : "";
      const sourceContent = cleanContent.length > 50 ? cleanContent : post.title;

      const summary = await summarizeBlogPost(post.title, sourceContent);
      const fullContent = `${summary.content}\n\n원문 보기: ${post.link}`;

      const created = await addNotice({
        title: summary.title,
        content: fullContent,
        pinned: false,
        created_at: post.publishedAt,
      });

      if (!created) {
        errors.push(`${post.title}: 공지사항 생성 실패`);
        continue;
      }

      await markProcessed(post.link, post.title, created.id);
      imported += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${post.title}: ${msg}`);
    }
  }

  return {
    imported,
    skipped: posts.length - newPosts.length,
    total: posts.length,
    errors,
  };
}

/** 관리자 수동 동기화 버튼 — body.secret 인증 */
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

/** Vercel Cron 자동 동기화 (매일 KST 00:00 = UTC 15:00) — Bearer CRON_SECRET 인증 */
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
