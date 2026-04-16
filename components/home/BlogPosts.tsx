import FaIcon from "@/components/ui/FaIcon";
import { NAVER_BLOG_URL } from "@/data/blogPosts";
import { fetchLatestBlogPosts } from "@/lib/blogFeed";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default async function BlogPosts() {
  const posts = await fetchLatestBlogPosts();

  return (
    <div className="rounded-xl bg-surface border border-border/50 p-6 md:p-7 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] flex items-center justify-center text-primary">
            <FaIcon name="book-open" className="w-4 h-4" />
          </div>
          <h3 className="text-base font-medium text-[#444444]">블로그 최신글</h3>
        </div>
        <a
          href={NAVER_BLOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-sub hover:text-primary transition-colors"
        >
          전체보기 →
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-text-hint">등록된 블로그 글이 없습니다.</p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-border/50">
          {posts.map((post, i) => (
            <li key={i}>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 py-3 group min-w-0"
              >
                <span className="text-sm text-text group-hover:text-primary transition-colors truncate flex-1 min-w-0">
                  {post.title}
                </span>
                <span className="hidden md:inline text-xs text-text-hint shrink-0">
                  {formatDate(post.date)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
