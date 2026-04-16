"use client";

import { testimonials } from "@/data/testimonials";

export default function TestimonialCarousel() {
  const mid = Math.ceil(testimonials.length / 2);
  const row1 = testimonials.slice(0, mid);
  const row2 = testimonials.slice(mid);

  return (
    <section className="bg-bg py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 mb-12">
        <p className="text-center text-xs font-medium tracking-[0.2em] uppercase text-text-hint mb-6">
          학부모 후기
        </p>
        <h2 className="text-center text-[22px] font-medium text-[#444444] md:text-3xl">
          성진학원을 선택한 이유
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="group mb-4">
        <div className="flex gap-4 animate-scroll-left hover:[animation-play-state:paused]">
          {[...row1, ...row1].map((t, i) => (
            <div
              key={`r1-${i}`}
              className="w-[340px] shrink-0 rounded-xl border border-border/50 bg-surface p-6"
            >
              <div className="text-primary/20 text-3xl leading-none font-serif mb-3">&ldquo;</div>
              <p className="text-text text-[14px] leading-relaxed line-clamp-5">
                {t.content}
              </p>
              <div className="text-primary/20 text-3xl leading-none font-serif text-right mt-3">&rdquo;</div>
              <p className="mt-2 text-xs font-medium text-primary">
                — {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="group">
        <div className="flex gap-4 animate-scroll-right hover:[animation-play-state:paused]">
          {[...row2, ...row2].map((t, i) => (
            <div
              key={`r2-${i}`}
              className="w-[340px] shrink-0 rounded-xl border border-border/50 bg-surface p-6"
            >
              <div className="text-primary/20 text-3xl leading-none font-serif mb-3">&ldquo;</div>
              <p className="text-text text-[14px] leading-relaxed line-clamp-5">
                {t.content}
              </p>
              <div className="text-primary/20 text-3xl leading-none font-serif text-right mt-3">&rdquo;</div>
              <p className="mt-2 text-xs font-medium text-primary">
                — {t.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
