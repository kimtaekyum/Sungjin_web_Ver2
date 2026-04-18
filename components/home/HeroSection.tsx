"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const SLIDES = [
  { desktop: "/images/hero/desktop-1.png", mobile: "/images/hero/mobile-1.png" },
  { desktop: "/images/hero/desktop-2.png", mobile: "/images/hero/mobile-2.png" },
  { desktop: "/images/hero/desktop-3.png", mobile: "/images/hero/mobile-3.png" },
];

const INTERVAL = 3500;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="relative bg-[#2C2C2A] overflow-hidden -mt-16 md:mt-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ===== Mobile ===== */}
      <div className="md:hidden relative w-full pt-16">
        <div className="relative w-full aspect-[2323/4193]">
          {SLIDES.map((slide, i) => (
            <Image
              key={i}
              src={slide.mobile}
              alt="성진학원"
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* CTA */}
          <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-2.5 z-10">
            <Button variant={current === 0 ? "secondary" : "primary"} href={current === 0 ? "/about" : "/programs"} className="w-full">
              {current === 0 ? "학원 소개 보기" : "수업 안내 보기"}
            </Button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`배너 ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Desktop ===== */}
      <div className="hidden md:block relative w-full pt-16">
        <div className="relative w-full aspect-[2/1]">
          {SLIDES.map((slide, i) => (
            <Image
              key={i}
              src={slide.desktop}
              alt="성진학원"
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* CTA */}
          <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-16 flex flex-row gap-3 z-10">
            <Button variant={current === 0 ? "secondary" : "primary"} href={current === 0 ? "/about" : "/contact"}>
              {current === 0 ? "학원 소개 보기" : "상담 신청하기"}
            </Button>
            {current !== 0 && (
              <Button variant="secondary" href="/programs">
                수업 안내 보기
              </Button>
            )}
          </div>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`배너 ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-2.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
