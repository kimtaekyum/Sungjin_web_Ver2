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

export async function POST(request: Request) {
  // 1. Auth check
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

  // 2. Fetch latest posts and processed IDs
  const posts = await fetchLatestBlogPosts();
  const processedIds = await getProcessedIds();

  const newPosts = posts.filter((p) => !processedIds.has(p.link));

  const errors: string[] = [];
  let imported = 0;

  // 3. For each new post: summarize → create notice → mark processed
  for (const post of newPosts) {
    try {
      const cleanContent = post.description ? stripHtml(post.description) : "";
      const sourceContent =
        cleanContent.length > 50 ? cleanContent : post.title; // 본문이 너무 짧으면 제목만 전달

      const summary = await summarizeBlogPost(post.title, sourceContent);

      // 공지사항 content 끝에 원문 링크 추가
      const fullContent = `${summary.content}\n\n원문 보기: ${post.link}`;

      const created = await addNotice({
        title: summary.title,
        content: fullContent,
        pinned: false,
        // 블로그 글의 실제 발행 시각을 created_at으로 저장 → 최신 글이 공지 목록 상단
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

  return NextResponse.json({
    imported,
    skipped: posts.length - newPosts.length,
    total: posts.length,
    errors,
  });
}
