"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import { VideoGridSkeleton } from "@/components/ui/Skeleton";
import { getVideos, type Video } from "@/lib/videos";

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

  useEffect(() => {
    getVideos().then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionTitle
          title="공부하기"
          subtitle={<>수업에서 배운 내용을 <span className="text-primary">강의 영상</span>으로 복습하세요</>}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video) => (
              <div
                key={video.id}
                className="rounded-xl border border-border/50 bg-surface overflow-hidden card-hover"
              >
                <div className="relative w-full aspect-video bg-black">
                  {playingId === video.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
                      title={video.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerate; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
        )}
      </div>
    </section>
  );
}
