"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import { NoticeListSkeleton } from "@/components/ui/Skeleton";
import { getNotices, type Notice } from "@/lib/notices";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    getNotices().then((data) => {
      setNotices(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionTitle
          title="공지사항"
          subtitle="성진학원의 새로운 소식을 확인하세요"
        />

        {loading ? (
          <NoticeListSkeleton count={5} />
        ) : notices.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-xl bg-surface border border-border/50 p-16 text-center">
            <div className="text-text-hint mb-3">
              <FaIcon name="clipboard-list" className="w-10 h-10 mx-auto" />
            </div>
            <p className="text-text-sub text-sm">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                  notice.pinned ? "border-primary/20 bg-[#FDF2F2]" : "border-border/50 bg-surface"
                }`}
              >
                <button
                  onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
                  className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                        고정
                      </span>
                    )}
                    <span className="font-medium text-text truncate">{notice.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-text-hint">
                      {new Date(notice.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <svg
                      className={`h-4 w-4 text-text-hint transition-transform duration-200 ${
                        expandedId === notice.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {notice.content && (() => {
                  // "원문 보기: <URL>" 패턴 추출 (네이버 블로그 원문 링크)
                  const sourceMatch = notice.content.match(
                    /원문\s*보기\s*[:：]\s*(https?:\/\/\S+)/
                  );
                  const sourceUrl = sourceMatch?.[1];
                  const body = sourceUrl
                    ? notice.content.replace(sourceMatch![0], "").trim()
                    : notice.content;

                  return (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedId === notice.id ? "max-h-[32rem] pb-5" : "max-h-0"
                      }`}
                    >
                      <p className="px-5 text-text-sub text-[15px] leading-relaxed whitespace-pre-wrap">
                        {body}
                      </p>
                      {sourceUrl && (
                        <div className="px-5 mt-4 flex justify-end">
                          <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary px-4 py-2 text-sm font-medium transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            네이버 블로그에서 원문 보기
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
