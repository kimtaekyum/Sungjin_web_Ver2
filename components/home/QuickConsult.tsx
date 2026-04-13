"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import FaIcon from "@/components/ui/FaIcon";
import { ACADEMY_INFO } from "@/lib/constants";

export default function QuickConsult() {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    grade: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          {/* Left: Map + Info */}
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-text-hint mb-4">
              오시는 길
            </p>
            <h2 className="text-[22px] font-medium text-[#444444] mb-6 md:text-3xl">
              성진학원을 방문해주세요
            </h2>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden bg-bg min-h-[240px] flex items-center justify-center mb-6 border border-border/50">
              <div className="text-center p-8">
                <div className="text-text-hint mb-3">
                  <FaIcon name="location-dot" className="w-10 h-10" />
                </div>
                <p className="text-sm text-text-sub">지도 영역</p>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-surface border border-border/50 p-4 text-center">
                <div className="text-primary mb-1">
                  <FaIcon name="location-dot" className="w-5 h-5 mx-auto" />
                </div>
                <p className="text-xs text-text-sub mb-0.5">주소</p>
                <p className="text-[13px] font-medium text-text">{ACADEMY_INFO.address}</p>
              </div>
              <div className="rounded-xl bg-surface border border-border/50 p-4 text-center">
                <div className="text-primary mb-1">
                  <FaIcon name="phone" className="w-5 h-5 mx-auto" />
                </div>
                <p className="text-xs text-text-sub mb-0.5">전화</p>
                <a href={`tel:${ACADEMY_INFO.phone}`} className="text-[13px] font-medium text-primary hover:underline">
                  {ACADEMY_INFO.phone}
                </a>
              </div>
              <div className="rounded-xl bg-surface border border-border/50 p-4 text-center">
                <div className="text-primary mb-1">
                  <FaIcon name="clock" className="w-5 h-5 mx-auto" />
                </div>
                <p className="text-xs text-text-sub mb-0.5">운영시간</p>
                <p className="text-[13px] font-medium text-text">월~토 14:00–22:00</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-xl bg-surface border border-border/50 p-7 md:p-9">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#D4F0E0] flex items-center justify-center mb-4 text-success">
                  <FaIcon name="circle-check" className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-[#444444] mb-2">
                  상담 신청이 완료되었습니다
                </h3>
                <p className="text-sm text-text-sub">
                  영업일 1일 이내에 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-medium text-[#444444] mb-1">
                    빠른 상담 신청
                  </h3>
                  <p className="text-sm text-text-sub">
                    간단히 정보를 남겨주시면 연락드리겠습니다.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    학부모명 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    연락처 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    학생 학년 <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  >
                    <option value="">선택하세요</option>
                    <option value="초4">초등 4학년</option>
                    <option value="초5">초등 5학년</option>
                    <option value="초6">초등 6학년</option>
                    <option value="중1">중학교 1학년</option>
                    <option value="중2">중학교 2학년</option>
                    <option value="중3">중학교 3학년</option>
                    <option value="고1">고등학교 1학년</option>
                    <option value="고2">고등학교 2학년</option>
                    <option value="고3">고등학교 3학년</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" className="w-full rounded-lg">
                  상담 신청하기
                </Button>
                <p className="text-xs text-text-sub text-center">
                  제출된 개인정보는 상담 목적으로만 사용됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
