"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const DESKTOP_SLIDES = [
  "/images/hero/desktop-1.png",
  "/images/hero/desktop-2.png",
  "/images/hero/desktop-3.png",
];

const MOBILE_SLIDES = [
  "/images/hero/mobile-1.png",
  "/images/hero/mobile-2.png",
  "/images/hero/mobile-3.png",
  "/images/hero/mobile-4.png",
];

const INTERVAL = 3500;

export default function HeroSection() {
  const [mobileIdx, setMobileIdx] = useState(0);
  const [desktopIdx, setDesktopIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const mobileTimer = setInterval(
      () => setMobileIdx((i) => (i + 1) % MOBILE_SLIDES.length),
      INTERVAL
    );
    const desktopTimer = setInterval(
      () => setDesktopIdx((i) => (i + 1) % DESKTOP_SLIDES.length),
      INTERVAL
    );
    return () => {
      clearInterval(mobileTimer);
      clearInterval(desktopTimer);
    };
  }, [paused]);

  return (
    <section
      className="relative bg-[#2C2C2A] overflow-hidden -mt-16 md:mt-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ===== Mobile ===== */}
      <div className="md:hidden relative w-full pt-16">
        <div className="relative w-full aspect-[2323/4193]">
          {MOBILE_SLIDES.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="성진학원"
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${
                i === mobileIdx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Prev/Next (모바일: 항상 표시, 작고 반투명) */}
          <button
            onClick={() => setMobileIdx((i) => (i - 1 + MOBILE_SLIDES.length) % MOBILE_SLIDES.length)}
            aria-label="이전 배너"
            className="absolute top-1/2 -translate-y-1/2 left-2 z-10 h-9 w-9 rounded-full bg-black/25 text-white flex items-center justify-center active:bg-black/40 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setMobileIdx((i) => (i + 1) % MOBILE_SLIDES.length)}
            aria-label="다음 배너"
            className="absolute top-1/2 -translate-y-1/2 right-2 z-10 h-9 w-9 rounded-full bg-black/25 text-white flex items-center justify-center active:bg-black/40 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* CTA */}
          <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-2.5 z-10">
            <Button
              variant={mobileIdx === 0 ? "secondary" : "primary"}
              href={mobileIdx === 0 ? "/about" : "/programs"}
              className="w-full"
            >
              {mobileIdx === 0 ? "학원 소개 보기" : "수업 안내 보기"}
            </Button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {MOBILE_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIdx(i)}
                aria-label={`배너 ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === mobileIdx ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Desktop ===== */}
      <div className="hidden md:block relative w-full pt-16">
        <div className="group relative w-full aspect-[2/1]">
          {DESKTOP_SLIDES.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="성진학원"
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${
                i === desktopIdx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Prev/Next (데스크탑: 호버 시에만 표시) */}
          <button
            onClick={() => setDesktopIdx((i) => (i - 1 + DESKTOP_SLIDES.length) % DESKTOP_SLIDES.length)}
            aria-label="이전 배너"
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setDesktopIdx((i) => (i + 1) % DESKTOP_SLIDES.length)}
            aria-label="다음 배너"
            className="absolute top-1/2 -translate-y-1/2 right-4 z-10 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* CTA */}
          <div className="absolute bottom-12 left-12 lg:bottom-20 lg:left-24 flex flex-row gap-3 z-10">
            <Button
              variant={desktopIdx === 0 ? "secondary" : "primary"}
              href={desktopIdx === 0 ? "/about" : "/contact"}
            >
              {desktopIdx === 0 ? "학원 소개 보기" : "상담 신청하기"}
            </Button>
            {desktopIdx !== 0 && (
              <Button variant="secondary" href="/programs">
                수업 안내 보기
              </Button>
            )}
          </div>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {DESKTOP_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setDesktopIdx(i)}
                aria-label={`배너 ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === desktopIdx ? "w-8 bg-white" : "w-2.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
