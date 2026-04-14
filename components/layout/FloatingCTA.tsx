"use client";

import { ACADEMY_INFO } from "@/lib/constants";

export default function FloatingCTA() {
  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col gap-3 md:right-8 md:bottom-8">
      {/* 상담 신청 플로팅 버튼 */}
      <a
        href="/contact"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 transition-all duration-300 md:h-[60px] md:w-[60px]"
        aria-label="상담 신청"
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </a>

      {/* 카카오톡 플로팅 버튼 */}
      <a
        href={ACADEMY_INFO.kakaoLink}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] shadow-lg shadow-black/15 hover:shadow-xl hover:scale-105 transition-all duration-300 md:h-[60px] md:w-[60px]"
        aria-label="카카오톡 상담"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.52 6.6-.2.72-.72 2.62-.82 3.02-.13.49.18.49.37.36.15-.1 2.37-1.6 3.33-2.26.52.08 1.05.12 1.6.12 5.52 0 10-3.58 10-7.9S17.52 3 12 3z" />
        </svg>
      </a>
    </div>
  );
}
