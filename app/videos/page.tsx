"use client";

import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import { VideoGridSkeleton } from "@/components/ui/Skeleton";
import { getVideos, type Video } from "@/lib/videos";

type SortOrder = "newest" | "oldest";

/** 정렬 기준값. 날짜가 비었거나 깨져 있어도 정렬이 흐트러지지 않도록 0으로 떨어뜨린다. */
function publishedTime(video: Video): number {
  const time = new Date(video.published_at).getTime();
  return isNaN(time) ? 0 : time;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    getVideos().then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const sortedVideos = useMemo(() => {
    const direction = sortOrder === "newest" ? -1 : 1;
    return [...videos].sort((a, b) => (publishedTime(a) - publishedTime(b)) * direction);
  }, [videos, sortOrder]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionTitle
          title="강의영상"
          subtitle={<>수업에서 배운 내용을 <span className="text-primary">영상으로 복습</span>하세요</>}
        />

        {loading ? (
          <VideoGridSkeleton count={6} />
        ) : videos.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-xl bg-surface border border-border/50 p-16 text-center">
            <div className="text-text-hint mb-3">
              <FaIcon name="circle-play" className="w-10 h-10 mx-auto" />
            </div>
            <p className="text-text-sub text-sm">등록된 강의 영상이 없습니다.</p>
          </div>
        ) : (
          <>
            {videos.length > 1 && (
              <div className="flex justify-end mb-5">
                <div
                  className="inline-flex rounded-lg border border-border/50 bg-surface p-0.5"
                  role="group"
                  aria-label="영상 정렬 순서"
                >
                  {([
                    { value: "newest", label: "최신순" },
                    { value: "oldest", label: "오래된순" },
                  ] as const).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSortOrder(value)}
                      aria-pressed={sortOrder === value}
                      className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-colors cursor-pointer ${
                        sortOrder === value
                          ? "bg-primary text-white"
                          : "text-text-sub hover:text-primary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedVideos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-xl border border-border/50 bg-surface overflow-hidden card-hover"
                >
                  <div className="relative w-full aspect-video bg-black">
                    {playingId === video.id ? (
                      <iframe
                        // playsinline: iOS에서 전체화면으로 튀지 않고 카드 안에서 재생되게 한다
                        src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&playsinline=1&rel=0`}
                        title={video.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingId(video.id)}
                        className="absolute inset-0 h-full w-full group cursor-pointer"
                        aria-label={`${video.title} 재생`}
                      >
                        {video.thumbnail_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        )}
                        <span className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                          <FaIcon
                            name="circle-play"
                            className="w-12 h-12 text-white/90 group-hover:text-white transition-colors drop-shadow"
                          />
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-text text-[15px] leading-snug line-clamp-2">
                      {video.title}
                    </h3>
                    {video.summary && (
                      <p className="mt-2 text-text-sub text-sm leading-relaxed line-clamp-3">
                        {video.summary}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-text-hint">
                      {formatDate(video.published_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
