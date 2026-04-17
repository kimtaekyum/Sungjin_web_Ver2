"use client";

import { useEffect, useRef, useState } from "react";
import FaIcon from "@/components/ui/FaIcon";

interface Stat {
  label: React.ReactNode;
  value: string;
  prefix?: string;
  suffix?: string;
  icon: string;
  duration?: number;
}

const stats: Stat[] = [
  { label: "운영 기간", value: "30", suffix: "년+", icon: "landmark" },
  { label: <>23·26학년도 <span className="text-primary">서울대 약대</span></>, value: "2", suffix: "회 배출", icon: "graduation-cap", duration: 900 },
  { label: <>2026학년도 <span className="text-primary">대학 합격률</span></>, value: "100", suffix: "%", icon: "flask" },
  { label: "1대1 밀착 첨삭", value: "100", suffix: "%", icon: "pencil" },
];

function AnimatedNumber({ value, prefix, suffix, duration: durationProp }: { value: string; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const num = parseInt(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = durationProp ?? 1800;
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * num).toString());
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [num]);

  return (
    <div ref={ref} className="font-heading text-4xl font-semibold tracking-tight text-primary md:text-[56px] leading-none">
      {prefix && <span className="text-primary text-2xl md:text-3xl mr-0.5">{prefix}</span>}
      {display}
      <span className="text-text-sub text-xl md:text-2xl ml-0.5">{suffix}</span>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative bg-surface py-16 md:py-24 overflow-hidden">
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6">
        <p className="text-center text-base font-medium tracking-[0.15em] text-text-sub mb-10 md:mb-14 md:text-lg">
          <span className="text-primary">성진학원</span>이 걸어온 길
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FDF2F2] mb-4 text-primary">
                <FaIcon name={stat.icon} className="w-5 h-5" />
              </div>
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={stat.duration} />
              <p className="mt-3 text-[15px] text-text-sub md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
