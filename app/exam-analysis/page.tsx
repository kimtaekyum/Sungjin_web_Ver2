"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  LEVEL_LABELS, SUBJECT_LABELS, EXAM_LABELS, subjectsForLevel,
  type ExamResource, type ResourceLevel, type ResourceSubject, type ExamType,
} from "@/lib/resources";

export default function ExamAnalysisPage() {
  const [level, setLevel] = useState<ResourceLevel>("middle");
  const [year, setYear] = useState("2026");
  const [semester, setSemester] = useState("2");
  const [subject, setSubject] = useState<ResourceSubject>("korean");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<ExamResource[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [schoolName, setSchoolName] = useState("");
  const [schools, setSchools] = useState<string[]>([]);
  const [grade, setGrade] = useState("");
  const [exam, setExam] = useState<ExamType | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ level, year, semester, subject, schoolName, grade, exam, q: query, page: String(page) });
    fetch(`/api/resources?${params}`, { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "자료 목록을 불러오지 못했습니다.");
        if (controller.signal.aborted) return;
        setItems(data.items);
        setHasMore(data.hasMore);
        setSchools(data.schools ?? []);
        setTotal(data.total ?? data.items.length);
        setError("");
      })
      .catch((err) => {
        if (err.name !== "AbortError") { setItems([]); setHasMore(false); setError(err.message); }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [level, year, semester, subject, schoolName, grade, exam, query, page, reload]);

  const resetFilters = () => {
    setSchoolName(""); setGrade(""); setExam(""); setQuery(""); setSearchInput(""); setPage(0);
  };

  const selectLevel = (next: ResourceLevel) => {
    if (next === level) return;
    setLevel(next); setSubject("korean"); resetFilters(); setLoading(true);
  };
  const years = Array.from({ length: Math.max(1, new Date().getFullYear() - 2024) }, (_, i) => String(2026 + i)).reverse();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1000px] px-4 md:px-6">
        <SectionTitle title="내신분석실" subtitle="학기별 내신 분석 자료를 PDF로 내려받으세요" />

        <div className="rounded-2xl border border-border/60 bg-surface p-5 md:p-8">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-text">학교</p>
              <div className="flex flex-wrap gap-2">
                {(["middle", "high"] as const).map((value) => (
                  <button key={value} type="button" onClick={() => selectLevel(value)} aria-pressed={level === value}
                    className={`rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer ${level === value ? "bg-primary text-white" : "bg-bg text-text-sub hover:text-primary"}`}>
                    {LEVEL_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="resource-year" className="mb-2 block text-sm font-semibold text-text">연도</label>
                <select id="resource-year" value={year} onChange={(e) => { setYear(e.target.value); resetFilters(); setLoading(true); }}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm">
                  {years.map((value) => <option key={value} value={value}>{value}년</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="resource-semester" className="mb-2 block text-sm font-semibold text-text">학기</label>
                <select id="resource-semester" value={semester} onChange={(e) => { setSemester(e.target.value); resetFilters(); setLoading(true); }}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm">
                  <option value="1">1학기</option><option value="2">2학기</option>
                </select>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-text">과목</p>
              <div className="flex flex-wrap gap-2">
                {subjectsForLevel(level).map((value) => (
                  <button key={value} type="button" onClick={() => { if (value === subject) return; setSubject(value); resetFilters(); setLoading(true); }} aria-pressed={subject === value}
                    className={`rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer ${subject === value ? "bg-primary text-white" : "bg-bg text-text-sub hover:text-primary"}`}>
                    {SUBJECT_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label htmlFor="filter-school" className="text-sm font-semibold">학교명
                <select id="filter-school" value={schoolName} onChange={(e) => { setSchoolName(e.target.value); setPage(0); setLoading(true); }} className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-normal">
                  <option value="">전체 학교</option>{schools.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label htmlFor="filter-grade" className="text-sm font-semibold">학년
                <select id="filter-grade" value={grade} onChange={(e) => { setGrade(e.target.value); setPage(0); setLoading(true); }} className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-normal">
                  <option value="">전체 학년</option>{["1", "2", "3"].map((value) => <option key={value} value={value}>{value}학년</option>)}
                </select>
              </label>
              <label htmlFor="filter-exam" className="text-sm font-semibold">시험 구분
                <select id="filter-exam" value={exam} onChange={(e) => { setExam(e.target.value as ExamType | ""); setPage(0); setLoading(true); }} className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-normal">
                  <option value="">전체 시험</option>{Object.entries(EXAM_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
            <form role="search" onSubmit={(event) => {
              event.preventDefault();
              const next = searchInput.trim();
              if (next === query && page === 0) return;
              setQuery(next); setPage(0); setLoading(true);
            }}>
              <label htmlFor="resource-search" className="mb-2 block text-sm font-semibold">자료 검색</label>
              <div className="flex gap-2">
                <input id="resource-search" type="search" maxLength={100} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="학교명 또는 자료 제목 검색" className="min-w-0 flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm" />
                <button type="submit" className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white">검색</button>
              </div>
              {(schoolName || grade || exam || query || searchInput) && <button type="button" onClick={() => {
                const changed = Boolean(schoolName || grade || exam || query || page);
                resetFilters(); if (changed) setLoading(true);
              }} className="mt-3 text-sm text-text-sub underline underline-offset-4">검색 조건 초기화</button>}
            </form>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-text">{LEVEL_LABELS[level]} · {year}년 · {semester}학기 · {SUBJECT_LABELS[subject]}</h2>
          {!loading && !error && <p role="status" className="mb-4 text-sm text-text-sub">{query && `‘${query}’ 검색 · `}총 {total}개 자료</p>}
          {loading ? <p className="rounded-xl border border-border bg-surface p-10 text-center text-text-sub">자료를 불러오는 중입니다...</p>
            : error ? <div role="alert" className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-danger">{error}</p>
                <button type="button" onClick={() => { setLoading(true); setReload((value) => value + 1); }} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm">다시 시도</button>
              </div>
            : items.length === 0 ? <p className="rounded-xl border border-border bg-surface p-10 text-center text-text-sub">{schoolName || grade || exam || query ? "검색 조건에 맞는 자료가 없습니다. 조건을 바꾸거나 초기화해주세요." : "등록된 PDF 자료가 없습니다."}</p>
            : <ul className="space-y-3">
                {items.map((item) => <li key={item.path} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <p className="break-all font-medium text-text">{item.title || item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[item.schoolName, item.grade && `${item.grade}학년`, item.exam && EXAM_LABELS[item.exam]].filter(Boolean).map((label) => <span key={label} className="max-w-full break-all rounded-md bg-bg px-2 py-1 text-xs text-text-sub">{label}</span>)}
                      {!item.schoolName && !item.grade && !item.exam && <span className="rounded-md bg-bg px-2 py-1 text-xs text-text-sub">공통 자료</span>}
                    </div>
                    <p className="mt-1 text-xs text-text-hint">PDF · {item.size ? `${(item.size / 1024 / 1024).toFixed(1)} MB · ` : ""}{new Date(item.createdAt).toLocaleDateString("ko-KR")}</p>
                  </div>
                  <a href={`/api/resources/download?path=${encodeURIComponent(item.path)}`}
                    className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-hover">
                    다운로드
                  </a>
                </li>)}</ul>}
          {(page > 0 || hasMore) && <div className="mt-5 flex justify-center gap-3">
            <button type="button" disabled={page === 0 || loading} onClick={() => { setPage(page - 1); setLoading(true); }} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">이전</button>
            <span className="self-center text-sm text-text-sub">{page + 1}페이지</span>
            <button type="button" disabled={!hasMore || loading} onClick={() => { setPage(page + 1); setLoading(true); }} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">다음</button>
          </div>}
        </div>
      </div>
    </section>
  );
}
