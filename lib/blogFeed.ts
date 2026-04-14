import type { BlogPost } from "@/data/blogPosts";
import { blogPosts as fallbackPosts } from "@/data/blogPosts";

const NAVER_BLOG_ID = "sja6123";
const RSS_URL = `https://rss.blog.naver.com/${NAVER_BLOG_ID}.xml`;

function extract(item: string, tag: string): string {
  const cdataRegex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const cdataMatch = cdataRegex.exec(item);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainRegex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const plainMatch = plainRegex.exec(item);
  return plainMatch ? plainMatch[1].trim() : "";
}

function pubDateToISO(pubDate: string): string {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function pubDateToFullISO(pubDate: string): string {
  if (!pubDate) return "";
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return "";
  return d.toISOString();
}

export async function fetchLatestBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 }, // 1 hour cache
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SeongjinBot/1.0)",
      },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

    const posts: BlogPost[] = items.slice(0, 5).map((item) => {
      const pubDate = extract(item, "pubDate");
      return {
        title: extract(item, "title"),
        link: extract(item, "link"),
        date: pubDateToISO(pubDate),
        publishedAt: pubDateToFullISO(pubDate),
        description: extract(item, "description"),
      };
    });

    const valid = posts.filter((p) => p.title && p.link);
    if (valid.length === 0) throw new Error("No valid posts parsed");

    return valid;
  } catch (err) {
    console.warn("블로그 RSS 로드 실패, fallback 사용:", err);
    return fallbackPosts;
  }
}
