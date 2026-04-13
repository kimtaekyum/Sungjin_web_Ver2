"use client";

import { ACADEMY_INFO } from "@/lib/constants";

export default function FloatingCTA() {
  return (
    <>
      {/* 카카오톡 플로팅 버튼 (우하단) */}
      <a
        href={ACADEMY_INFO.kakaoLink}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] shadow-lg shadow-black/15 hover:shadow-xl hover:scale-105 transition-all duration-300 md:bottom-8 md:right-8 md:h-[60px] md:w-[60px]"
        aria-label="카카오톡 상담"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.52 6.6-.2.72-.72 2.62-.82 3.02-.13.49.18.49.37.36.15-.1 2.37-1.6 3.33-2.26.52.08 1.05.12 1.6.12 5.52 0 10-3.58 10-7.9S17.52 3 12 3z" />
        </svg>
      </a>

      {/* 모바일 하단 고정 CTA 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t border-border/50 bg-surface/95 backdrop-blur-md safe-bottom">
        <a
          href={`tel:${ACADEMY_INFO.phone}`}
          className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-[13px] font-medium text-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          전화
        </a>
        <a
          href={ACADEMY_INFO.kakaoLink}
          className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-[13px] font-medium text-[#3C1E1E] bg-[#FEE500]"
        >
          카카오톡
        </a>
        <a
          href="/contact"
          className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-[13px] font-medium text-white bg-primary"
        >
          상담 신청
        </a>
      </div>
    </>
  );
}
