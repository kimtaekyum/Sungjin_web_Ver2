"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import { strengths, type StrengthPhoto } from "@/data/strengths";

const FAN_ANGLES = [-12, 0, 12];
const FAN_ANGLES_2 = [-8, 8];

const H_MOBILE_3 = 140;
const H_MOBILE_2 = 175;
const H_DESKTOP = 209;

function PhotoFan({ photos, visible, overlap = "normal", mobileHeight }: { photos: StrengthPhoto[]; visible: boolean; overlap?: "tight" | "normal" | "loose"; mobileHeight?: number }) {
  const angles = photos.length === 2 ? FAN_ANGLES_2 : FAN_ANGLES;
  const overlapClass = overlap === "loose"
    ? "-mx-0.5 md:-mx-1"
    : photos.length === 2 ? "-mx-2 md:-mx-1" : "-mx-4 md:-mx-3";
  return (
    <div
      className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex items-end justify-center pointer-events-none transition-all duration-300 ${
        visible ? "opacity-100 -translate-y-full" : "opacity-0 -translate-y-[80%] scale-95"
      }`}
    >
      {photos.map((p, i) => {
        const s = p.scale ?? 1;
        const hM = Math.round((mobileHeight ?? (photos.length === 2 ? H_MOBILE_2 : H_MOBILE_3)) * s);
        const wM = Math.round(hM * p.ratio);
        const hD = Math.round(H_DESKTOP * s);
        const wD = Math.round(hD * p.ratio);
        return (
          <div
            key={i}
            className={`flex-shrink-0 ${overlapClass}`}
            style={{
              transform: `rotate(${angles[i]}deg)`,
              zIndex: i === Math.floor(photos.length / 2) ? 3 : i === 0 ? 1 : 2,
            }}
          >
            <div
              className="photo-card rounded-lg overflow-hidden shadow-lg border-2 border-white"
              style={{
                "--w-m": `${wM}px`,
                "--h-m": `${hM}px`,
                "--w-d": `${wD}px`,
                "--h-d": `${hD}px`,
              } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StrengthCards() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [scrollActiveId, setScrollActiveId] = useState<number | null>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const isMobile = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    isMobile.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { isMobile.current = e.matches; };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isMobile.current) return;
        entries.forEach((entry) => {
          const id = Number(entry.target.getAttribute("data-strength-id"));
          if (entry.isIntersecting) {
            setScrollActiveId(id);
          } else {
            setScrollActiveId((prev) => (prev === id ? null : prev));
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setCardRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  const visibleId = activeId ?? scrollActiveId;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionTitle
          title={<>성진학원 <span className="text-primary">6가지 강점</span></>}
          subtitle={<>학생의 <span className="text-primary">성장</span>을 위한 체계적인 교육 시스템</>}
        />
        <div className="grid gap-x-6 gap-y-6 md:gap-y-14 sm:grid-cols-2 lg:grid-cols-3 pt-6">
          {strengths.map((s) => (
            <div
              key={s.id}
              ref={(el) => s.photos && setCardRef(s.id, el)}
              data-strength-id={s.id}
              className="relative"
              onMouseEnter={() => s.photos && setActiveId(s.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              {s.photos && (
                <PhotoFan photos={s.photos} visible={visibleId === s.id} overlap={s.fanOverlap} mobileHeight={s.fanMobileHeight} />
              )}
              <div
                className={`group rounded-xl bg-surface border p-7 transition-all duration-200 cursor-default ${
                  visibleId === s.id
                    ? "border-primary/40 shadow-[0_4px_16px_-4px_rgba(184,29,34,0.15)]"
                    : "border-border/50 hover:border-[#9F9E9E]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FDF2F2] flex items-center justify-center text-primary">
                    <FaIcon name={s.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#444444] mb-2 md:text-lg">
                      {s.title}
                    </h3>
                    <p className="text-sm text-text-sub leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
