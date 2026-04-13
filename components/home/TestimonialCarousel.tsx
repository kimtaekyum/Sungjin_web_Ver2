"use client";

import { useState } from "react";

const testimonials = [
  {
    content: "첨삭 시스템 덕분에 아이가 수업에서 배운 내용을 확실히 이해하고 옵니다. 성적이 눈에 띄게 올랐어요.",
    author: "중2 학부모",
  },
  {
    content: "고등부 입시 상담이 정말 체계적입니다. 교수부장님의 1:1 로드맵 덕분에 대학 진학 방향이 명확해졌어요.",
    author: "고3 학부모",
  },
  {
    content: "매일 카톡으로 아이의 학습 상황을 알려주셔서 안심이 됩니다. 30년 경력답게 관리가 꼼꼼해요.",
    author: "초5 학부모",
  },
  {
    content: "수학 31점에서 71점까지 올랐습니다. 백지 테스트로 개념을 확실히 잡아주시더라고요.",
    author: "중3 학생",
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative bg-bg overflow-hidden">
      {/* Quote mark decoration */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[200px] leading-none font-serif text-border/40 select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 py-16 md:py-24">
        <p className="text-center text-xs font-medium tracking-[0.2em] uppercase text-text-hint mb-6">
          학부모·학생 후기
        </p>
        <h2 className="text-center text-[22px] font-medium text-[#444444] mb-12 md:text-3xl">
          성진학원을 선택한 이유
        </h2>

        <div className="max-w-2xl mx-auto">
          <div className="min-h-[160px] flex flex-col items-center justify-center">
            <p className="text-center text-text text-lg leading-relaxed md:text-xl md:leading-relaxed">
              &ldquo;{testimonials[current].content}&rdquo;
            </p>
            <p className="mt-6 text-primary font-medium text-sm">
              — {testimonials[current].author}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-surface transition-colors cursor-pointer"
              aria-label="이전 후기"
            >
              <svg className="h-5 w-5 text-text-hint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-border"
                  }`}
                  aria-label={`후기 ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-surface transition-colors cursor-pointer"
              aria-label="다음 후기"
            >
              <svg className="h-5 w-5 text-text-hint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
