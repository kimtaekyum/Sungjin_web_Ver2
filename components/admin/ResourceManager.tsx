"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  RESOURCE_BUCKET, LEVEL_LABELS, SUBJECT_LABELS, EXAM_LABELS, subjectsForLevel,
  type ExamResource, type ResourceLevel, type ResourceSubject, type ExamType,
} from "@/lib/resources";

export default function ResourceManager() {
  const [level, setLevel] = useState<ResourceLevel>("middle");
  const [year, setYear] = useState("2026");
  const [semester, setSemester] = useState("2");
  const [subject, setSubject] = useState<ResourceSubject>("korean");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [exam, setExam] = useState<ExamType | "">("");
  const [items, setItems] = useState<ExamResource[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ level, year, semester, subject, page: String(page) });
    fetch(`/api/resources?${params}`, { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "목록을 불러오지 못했습니다.");
        if (controller.signal.aborted) return;
        setItems(data.items);
        setHasMore(data.hasMore);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setItems([]);
        setHasMore(false);
        setMessage(err instanceof Error ? err.message : "목록을 불러오지 못했습니다.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [level, year, semester, subject, page, reload]);

  const reloadItems = () => {
    setLoading(true);
    setReload((value) => value + 1);
  };

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    return data.session.access_token;
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || busy) return;
    setMessage("");
    setBusy(true);
    try {
      if (!title.trim() || title.trim().length > 100) throw new Error("자료 제목은 1~100자로 입력해주세요.");
      if (!file.name.toLowerCase().endsWith(".pdf") || file.size > 50 * 1024 * 1024 || file.size === 0) {
        throw new Error("50MB 이하의 PDF 파일을 선택해주세요.");
      }
      const signature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
      if (signature !== "%PDF-") throw new Error("PDF 형식의 파일만 업로드할 수 있습니다.");
      const token = await getToken();
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ level, year, semester, subject, schoolName: schoolName.trim(), grade, exam, title: title.trim(), fileName: file.name, size: file.size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "업로드를 시작하지 못했습니다.");
      const pdf = new Blob([file], { type: "application/pdf" });
      const { error } = await supabase.storage.from(RESOURCE_BUCKET).uploadToSignedUrl(data.path, data.token, pdf, {
        contentType: "application/pdf",
      });
      if (error) throw new Error(error.message);
      setFile(null);
      setTitle("");
      const input = document.getElementById("resource-file") as HTMLInputElement | null;
      if (input) input.value = "";
      setMessage("PDF 자료를 등록했습니다.");
      setPage(0);
      reloadItems();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally { setBusy(false); }
  };

  const remove = async (item: ExamResource) => {
    if (!window.confirm(`‘${item.title || item.name}’ 자료를 삭제할까요?`)) return;
    setBusy(true);
    setMessage("");
    try {
      const token = await getToken();
      const res = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ path: item.path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "삭제하지 못했습니다.");
      setMessage("파일을 삭제했습니다.");
      if (items.length === 1 && page > 0) setPage(page - 1);
      reloadItems();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "삭제하지 못했습니다.");
    } finally { setBusy(false); }
  };

  const fieldClass = "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none";
  const years = Array.from({ length: Math.max(1, new Date().getFullYear() - 2024) }, (_, i) => String(2026 + i)).reverse();
  return <section className="max-w-4xl">
    <p className="mb-6 text-sm text-text-sub">PDF를 분류별로 등록하면 학생들이 내려받을 수 있습니다.</p>

    <form onSubmit={upload} className="rounded-2xl border border-border bg-surface p-5 md:p-7">
      <h2 className="mb-5 text-lg font-semibold">PDF 자료 등록</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">학교
          <select disabled={busy} value={level} onChange={(e) => { setLevel(e.target.value as ResourceLevel); setSubject("korean"); setPage(0); setLoading(true); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            <option value="middle">중등</option><option value="high">고등</option>
          </select>
        </label>
        <label className="text-sm font-medium">연도
          <select disabled={busy} value={year} onChange={(e) => { setYear(e.target.value); setPage(0); setLoading(true); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            {years.map((value) => <option key={value} value={value}>{value}년</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">학기
          <select disabled={busy} value={semester} onChange={(e) => { setSemester(e.target.value); setPage(0); setLoading(true); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            <option value="1">1학기</option><option value="2">2학기</option>
          </select>
        </label>
        <label className="text-sm font-medium">과목
          <select disabled={busy} value={subject} onChange={(e) => { setSubject(e.target.value as ResourceSubject); setPage(0); setLoading(true); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            {subjectsForLevel(level).map((value) => <option key={value} value={value}>{SUBJECT_LABELS[value]}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">학교명
          <input disabled={busy} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} maxLength={50} placeholder="예: 신월중학교" className={`mt-2 ${fieldClass}`} />
        </label>
        <label className="text-sm font-medium">학년
          <select disabled={busy} value={grade} onChange={(e) => setGrade(e.target.value)} className={`mt-2 ${fieldClass}`}>
            <option value="">공통 / 미지정</option>{["1", "2", "3"].map((value) => <option key={value} value={value}>{value}학년</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">시험 구분
          <select disabled={busy} value={exam} onChange={(e) => setExam(e.target.value as ExamType | "")} className={`mt-2 ${fieldClass}`}>
            <option value="">공통 / 미지정</option>{Object.entries(EXAM_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-text-hint">학교 공통 자료는 학교명을 비워두고, 학년·시험 구분을 미지정으로 등록할 수 있습니다.</p>
      <label htmlFor="resource-file" className="mt-5 block text-sm font-medium">PDF 파일 · 최대 50MB</label>
      <input id="resource-file" disabled={busy} type="file" accept=".pdf,application/pdf" required onChange={(e) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
        setTitle(selected?.name.replace(/\.pdf$/i, "").slice(0, 100) ?? "");
      }} className="mt-2 block min-w-0 w-full rounded-lg border border-border bg-white p-3 text-sm" />
      <label htmlFor="resource-title" className="mt-5 block text-sm font-medium">자료 제목</label>
      <input id="resource-title" disabled={busy} type="text" required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026년 2학기 국어 내신 분석" className={`mt-2 ${fieldClass}`} />
      <p className="mt-2 text-xs text-text-hint">파일명에서 자동으로 채워지며, 원하는 제목으로 수정할 수 있습니다.</p>
      <button type="submit" disabled={busy || !file || !title.trim()} className="mt-5 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "처리 중..." : "자료 등록"}</button>
      {message && <p role="status" className="mt-3 text-sm text-text-sub">{message}</p>}
    </form>

    <div className="mt-9">
      <h2 className="mb-4 text-lg font-semibold">{LEVEL_LABELS[level]} · {year}년 · {semester}학기 · {SUBJECT_LABELS[subject]} 자료</h2>
      {loading ? <p className="text-text-sub">목록을 불러오는 중입니다...</p> : items.length === 0 ? <p className="rounded-xl border border-border bg-surface p-8 text-center text-text-sub">등록된 파일이 없습니다.</p> :
        <ul className="space-y-2">{items.map((item) => <li key={item.path} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="min-w-0"><p className="break-all text-sm font-medium">{item.title || item.name}</p>
            <p className="mt-1 break-all text-xs text-text-sub">{[item.schoolName, item.grade && `${item.grade}학년`, item.exam && EXAM_LABELS[item.exam]].filter(Boolean).join(" · ") || "공통 자료"}</p>
            <p className="mt-1 break-all text-xs text-text-hint">{item.name} · {new Date(item.createdAt).toLocaleDateString("ko-KR")}</p></div>
          <button type="button" disabled={busy} onClick={() => void remove(item)} className="shrink-0 rounded-lg border border-danger/30 px-3 py-2 text-sm text-danger disabled:opacity-50">삭제</button>
        </li>)}</ul>}
      {(page > 0 || hasMore) && <div className="mt-5 flex justify-center gap-3">
        <button type="button" disabled={page === 0 || busy || loading} onClick={() => { setPage(page - 1); setLoading(true); }} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">이전</button>
        <span className="self-center text-sm text-text-sub">{page + 1}페이지</span>
        <button type="button" disabled={!hasMore || busy || loading} onClick={() => { setPage(page + 1); setLoading(true); }} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">다음</button>
      </div>}
    </div>
  </section>;
}
