"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  LEVEL_LABELS, SUBJECT_LABELS, EXAM_LABELS, RESOURCE_LEVELS, RESOURCE_SUBJECTS,
  type ExamResource, type ResourceLevel, type ResourceSubject, type ExamType,
} from "@/lib/resources";

export default function ExamAnalysisPage() {
  const [level, setLevel] = useState<ResourceLevel | "">("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState<ResourceSubject | "">("");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<ExamResource[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [schoolName, setSchoolName] = useState("");
  const [schools, setSchools] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [grade, setGrade] = useState("");
  const [exam, setExam] = useState<ExamType | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState(0);
  const hasFilters = Boolean(level || year || semester || subject || schoolName || grade || exam || query);

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
        setAvailableYears(data.years ?? []);
        setTotal(data.total ?? data.items.length);
        setError("");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setItems([]); setHasMore(false); setError(err.message);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [level, year, semester, subject, schoolName, grade, exam, query, page, reload]);

  const filterChanged = () => { setPage(0); setLoading(true); };
  const resetDefaults = () => {
    setLevel(""); setYear(""); setSemester(""); setSubject("");
    setSchoolName(""); setGrade(""); setExam(""); setQuery(""); setSearchInput(""); setPage(0);
    if (hasFilters || page > 0 || error) {
      setLoading(true);
      if (!hasFilters && page === 0) setReload((value) => value + 1);
    }
  };
  const years = [...new Set([
    ...Array.from({ length: Math.max(1, new Date().getFullYear() - 2024) }, (_, i) => String(2026 + i)),
    ...availableYears, ...(year ? [year] : []),
  ])].sort((a, b) => Number(b) - Number(a));
  const schoolOptions = [...new Set([...schools, ...(schoolName ? [schoolName] : [])])].sort((a, b) => a.localeCompare(b, "ko"));
  const fieldClass = "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-normal";
  const selectionClass = (selected: boolean) => `rounded-lg px-5 py-2.5 text-sm font-medium cursor-pointer ${selected ? "bg-primary text-white" : "bg-bg text-text-sub hover:text-primary"}`;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1000px] px-4 md:px-6">
        <SectionTitle title="내신분석실" subtitle="내신 분석 자료를 검색하고 PDF로 내려받으세요" />

        <div className="rounded-2xl border border-border/60 bg-surface p-5 md:p-8">
          <div className="space-y-6">
            <form role="search" onSubmit={(event) => {
              event.preventDefault();
              const next = searchInput.trim();
              if (next === query && page === 0) return;
              setQuery(next); filterChanged();
            }}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="resource-search" className="text-sm font-semibold text-text">통합 검색</label>
                <button type="button" onClick={resetDefaults} className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-sub hover:bg-bg cursor-pointer">기본값으로 초기화</button>
              </div>
              <div className="flex gap-2">
                <input id="resource-search" type="search" maxLength={100} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="과목, 학교명, 제목 등으로 검색" className="min-w-0 flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm" />
                <button type="submit" className="shrink-0 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white cursor-pointer">검색</button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-text-hint">기본 화면에서는 모든 자료가 표시됩니다. 검색어와 아래 조건을 선택하면 원하는 자료만 볼 수 있습니다.</p>
            </form>

            <div className="border-t border-border/50 pt-5">
              <p id="resource-level-label" className="mb-2 text-sm font-semibold text-text">학교</p>
              <div role="group" aria-labelledby="resource-level-label" className="flex flex-wrap gap-2">
                {(["", ...RESOURCE_LEVELS] as const).map((value) => (
                  <button key={value} type="button" onClick={() => { if (value !== level) { setLevel(value); filterChanged(); } }} aria-pressed={level === value} className={selectionClass(level === value)}>
                    {value ? LEVEL_LABELS[value] : "전체"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p id="resource-subject-label" className="mb-2 text-sm font-semibold text-text">과목</p>
              <div role="group" aria-labelledby="resource-subject-label" className="flex flex-wrap gap-2">
                {(["", ...RESOURCE_SUBJECTS] as const).map((value) => (
                  <button key={value} type="button" onClick={() => { if (value !== subject) { setSubject(value); filterChanged(); } }} aria-pressed={subject === value} className={selectionClass(subject === value)}>
                    {value ? SUBJECT_LABELS[value] : "전체"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label htmlFor="resource-year" className="text-sm font-semibold text-text">연도
                <select id="resource-year" value={year} onChange={(e) => { setYear(e.target.value); filterChanged(); }} className={`mt-2 ${fieldClass}`}>
                  <option value="">전체 연도</option>
                  {years.map((value) => <option key={value} value={value}>{value}년</option>)}
                </select>
              </label>
              <label htmlFor="filter-school" className="text-sm font-semibold text-text">학교명
                <select id="filter-school" value={schoolName} onChange={(e) => { setSchoolName(e.target.value); filterChanged(); }} className={`mt-2 ${fieldClass}`}>
                  <option value="">전체 학교명</option>{schoolOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <label htmlFor="filter-grade" className="text-sm font-semibold text-text">학년
                <select id="filter-grade" value={grade} onChange={(e) => { setGrade(e.target.value); filterChanged(); }} className={`mt-2 ${fieldClass}`}>
                  <option value="">전체 학년</option>{["1", "2", "3"].map((value) => <option key={value} value={value}>{value}학년</option>)}
                </select>
              </label>
              <label htmlFor="resource-semester" className="text-sm font-semibold text-text">학기
                <select id="resource-semester" value={semester} onChange={(e) => { setSemester(e.target.value); filterChanged(); }} className={`mt-2 ${fieldClass}`}>
                  <option value="">전체 학기</option><option value="1">1학기</option><option value="2">2학기</option>
                </select>
              </label>
              <label htmlFor="filter-exam" className="text-sm font-semibold text-text">시험 구분
                <select id="filter-exam" value={exam} onChange={(e) => { setExam(e.target.value as ExamType | ""); filterChanged(); }} className={`mt-2 ${fieldClass}`}>
                  <option value="">전체 시험</option>{Object.entries(EXAM_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-2 text-lg font-semibold text-text">{hasFilters ? "검색 결과" : "전체 자료"}</h2>
          <p className="mb-4 text-sm leading-relaxed text-text-sub">{level ? LEVEL_LABELS[level] : "전체 학교"} · {year ? `${year}년` : "전체 연도"} · {semester ? `${semester}학기` : "전체 학기"} · {subject ? SUBJECT_LABELS[subject] : "전체 과목"}</p>
          {!loading && !error && <p role="status" className="mb-4 text-sm text-text-sub">{query && `‘${query}’ 검색 · `}총 {total}개 자료</p>}
          {loading ? <p className="rounded-xl border border-border bg-surface p-10 text-center text-text-sub">자료를 불러오는 중입니다...</p>
            : error ? <div role="alert" className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-danger">{error}</p>
                <button type="button" onClick={() => { setLoading(true); setReload((value) => value + 1); }} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm">다시 시도</button>
              </div>
            : items.length === 0 ? <p className="rounded-xl border border-border bg-surface p-10 text-center text-text-sub">{hasFilters ? "검색 조건에 맞는 자료가 없습니다. 조건을 바꾸거나 초기화해주세요." : "등록된 PDF 자료가 없습니다."}</p>
            : <ul className="space-y-3">
                {items.map((item) => <li key={item.path} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <p className="break-all font-medium text-text">{item.title || item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[LEVEL_LABELS[item.level], `${item.year}년`, `${item.semester}학기`, SUBJECT_LABELS[item.subject],
                        item.schoolName, item.grade && `${item.grade}학년`, item.exam && EXAM_LABELS[item.exam]].filter(Boolean).map((label) => <span key={label} className="max-w-full break-all rounded-md bg-bg px-2 py-1 text-xs text-text-sub">{label}</span>)}
                    </div>
                    <p className="mt-1 text-xs text-text-hint">PDF · {item.size ? `${(item.size / 1024 / 1024).toFixed(1)} MB · ` : ""}{new Date(item.createdAt).toLocaleDateString("ko-KR")}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <a href={`/api/resources/preview?path=${encodeURIComponent(item.path)}`} target="_blank" rel="noopener noreferrer" aria-label={`${item.title || item.name} PDF 미리보기 (새 창)`} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-text hover:bg-bg sm:flex-none">미리보기</a>
                    <a href={`/api/resources/download?path=${encodeURIComponent(item.path)}`} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-hover sm:flex-none">다운로드</a>
                  </div>
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
