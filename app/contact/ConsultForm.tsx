"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FaIcon from "@/components/ui/FaIcon";

export default function ConsultForm() {
  const [formData, setFormData] = useState({
    parentName: "",
    phone: "",
    grade: "",
    subjects: [] as string[],
    preferredTime: "",
    memo: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#D4F0E0] flex items-center justify-center mb-4 text-success">
          <FaIcon name="circle-check" className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-[#444444] mb-2">
          상담 신청이 완료되었습니다
        </h3>
        <p className="text-sm text-text-sub mb-6">
          영업일 1일 이내에 연락드리겠습니다.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ parentName: "", phone: "", grade: "", subjects: [], preferredTime: "", memo: "" });
          }}
          className="text-sm text-primary hover:underline cursor-pointer"
        >
          추가 상담 신청하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 필수 입력 */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          학부모명 <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.parentName}
          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
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
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          placeholder="010-0000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          학생 <span className="text-danger">*</span>
        </label>
        <select
          required
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 bg-white transition-all"
        >
          <option value="">선택하세요</option>
          <option value="초등">초등학생</option>
          <option value="중등">중학생</option>
          <option value="고등">고등학생</option>
        </select>
      </div>

      {/* 선택 입력 */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          관심 과목 <span className="text-text-sub font-normal">(선택)</span>
        </label>
        <div className="flex gap-2">
          {["국어", "영어", "수학"].map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => handleSubjectToggle(subject)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                formData.subjects.includes(subject)
                  ? "bg-primary text-white"
                  : "bg-bg text-text-sub hover:bg-border"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          상담 희망 시간대 <span className="text-text-sub font-normal">(선택)</span>
        </label>
        <input
          type="text"
          value={formData.preferredTime}
          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          placeholder="예: 평일 오후 3~5시"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          메모 <span className="text-text-sub font-normal">(선택)</span>
        </label>
        <textarea
          value={formData.memo}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 resize-none transition-all"
          placeholder="추가로 궁금한 점을 남겨주세요"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full">
        상담 신청하기
      </Button>
      <p className="text-xs text-text-sub text-center">
        제출된 개인정보는 상담 목적으로만 사용됩니다.
      </p>
    </form>
  );
}
