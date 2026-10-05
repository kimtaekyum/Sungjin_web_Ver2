"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  RESOURCE_BUCKET, SUBJECT_LABELS, EXAM_LABELS, subjectsForLevel,
  type ExamResource, type ResourceLevel, type ResourceSubject, type ExamType,
} from "@/lib/resources";

import ResourceLibrary from "./ResourceLibrary";

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
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [listMessage, setListMessage] = useState("");
  const [reload, setReload] = useState(0);
  const [editing, setEditing] = useState<ExamResource | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reloadItems = () => setReload((value) => value + 1);

  const navigateToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    formRef.current?.querySelector("select")?.focus({ preventScroll: true });
  };

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    return data.session.access_token;
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if ((!file && !editing) || busy) return;
    setMessage("");
    setBusy(true);
    let pendingPath = "";
    try {
      if (!title.trim() || title.trim().length > 100) throw new Error("자료 제목은 1~100자로 입력해주세요.");
      if (file && (!file.name.toLowerCase().endsWith(".pdf") || file.size > 50 * 1024 * 1024 || file.size === 0)) {
        throw new Error("50MB 이하의 PDF 파일을 선택해주세요.");
      }
      const token = await getToken();
      const metadata = { level, year, semester, subject, schoolName: schoolName.trim(), grade, exam, title: title.trim() };
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      if (file) {
        const signature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
        if (signature !== "%PDF-") throw new Error("PDF 형식의 파일만 업로드할 수 있습니다.");
        const res = await fetch("/api/resources", {
          method: "POST", headers,
          body: JSON.stringify({ ...metadata, fileName: file.name, size: file.size,
            ...(editing ? { purpose: "replacement", originalPath: editing.path } : {}),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "업로드를 시작하지 못했습니다.");
        if (editing) pendingPath = data.path;
        const { error } = await supabase.storage.from(RESOURCE_BUCKET).uploadToSignedUrl(data.path, data.token, new Blob([file], { type: "application/pdf" }), { contentType: "application/pdf" });
        if (error) throw new Error(error.message);
      }
      let warning = "";
      if (editing) {
        const res = await fetch("/api/resources", { method: "PATCH", headers,
          body: JSON.stringify({ ...metadata, path: editing.path, ...(file ? { replacementPath: pendingPath, fileName: file.name } : {}) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "자료를 수정하지 못했습니다.");
        warning = data.warning ?? "";
      }
      setFile(null);
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      setMessage(warning || (editing ? (file ? "PDF를 교체하고 자료 정보를 저장했습니다." : "자료 정보를 수정했습니다.") : "PDF 자료를 등록했습니다."));
      setEditing(null);
      reloadItems();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      if (pendingPath) {
        try {
          const token = await getToken();
          await fetch("/api/resources", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ path: pendingPath }) });
        } catch (error) { console.error("임시 PDF 정리 요청 실패:", error); }
      }
      setBusy(false);
    }
  };

  const edit = (item: ExamResource) => {
    const [nextLevel, nextYear, nextSemester, nextSubject] = item.path.split("/");
    setLevel(nextLevel as ResourceLevel); setYear(nextYear); setSemester(nextSemester); setSubject(nextSubject as ResourceSubject);
    setEditing(item); setTitle(item.title); setSchoolName(item.schoolName ?? ""); setGrade(item.grade ?? ""); setExam(item.exam ?? "");
    setFile(null); if (fileRef.current) fileRef.current.value = "";
    setMessage("");
    navigateToForm();
  };

  const cancelEdit = () => {
    setEditing(null); setFile(null); setTitle(""); setMessage("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = async (item: ExamResource) => {
    if (!window.confirm(`‘${item.title || item.name}’ 자료를 삭제할까요?`)) return;
    setBusy(true);
    setListMessage("");
    try {
      const token = await getToken();
      const res = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ path: item.path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "삭제하지 못했습니다.");
      setListMessage("파일을 삭제했습니다.");
      reloadItems();
    } catch (err) {
      setListMessage(err instanceof Error ? err.message : "삭제하지 못했습니다.");
    } finally { setBusy(false); }
  };

  const fieldClass = "w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none";
  const years = [...new Set([
    ...Array.from({ length: Math.max(1, new Date().getFullYear() - 2024) }, (_, i) => String(2026 + i)), year,
  ])].sort((a, b) => Number(b) - Number(a));
  return <section className="max-w-4xl">
    <p className="mb-6 text-sm text-text-sub">PDF를 분류별로 등록하면 학생들이 내려받을 수 있습니다.</p>

    <form ref={formRef} onSubmit={upload} className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 md:p-7">
      <h2 className="mb-5 text-lg font-semibold">{editing ? "PDF 자료 수정" : "PDF 자료 등록"}</h2>
      <p className="mb-5 text-sm text-text-sub">등록할 자료의 학교·과목·연도·학기를 선택해주세요.</p>
      {editing && <p className="mb-5 break-all rounded-lg bg-bg p-3 text-sm text-text-sub">현재 파일: {editing.name}<br />파일을 선택하면 PDF가 교체됩니다. 선택하지 않으면 제목과 분류만 수정합니다.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">학교
          <select disabled={busy} value={level} onChange={(e) => { setLevel(e.target.value as ResourceLevel); setSubject("korean"); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            <option value="middle">중등</option><option value="high">고등</option>
          </select>
        </label>
        <label className="text-sm font-medium">과목
          <select disabled={busy} value={subject} onChange={(e) => { setSubject(e.target.value as ResourceSubject); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            {subjectsForLevel(level).map((value) => <option key={value} value={value}>{SUBJECT_LABELS[value]}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-medium">연도
          <select disabled={busy} value={year} onChange={(e) => { setYear(e.target.value); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            {years.map((value) => <option key={value} value={value}>{value}년</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">학교명
          <input disabled={busy} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} maxLength={50} placeholder="예: 신월중학교" className={`mt-2 ${fieldClass}`} />
        </label>
        <label className="text-sm font-medium">학년
          <select disabled={busy} value={grade} onChange={(e) => setGrade(e.target.value)} className={`mt-2 ${fieldClass}`}>
            <option value="">공통 / 미지정</option>{["1", "2", "3"].map((value) => <option key={value} value={value}>{value}학년</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">학기
          <select disabled={busy} value={semester} onChange={(e) => { setSemester(e.target.value); setMessage(""); }} className={`mt-2 ${fieldClass}`}>
            <option value="1">1학기</option><option value="2">2학기</option>
          </select>
        </label>
        <label className="text-sm font-medium">시험 구분
          <select disabled={busy} value={exam} onChange={(e) => setExam(e.target.value as ExamType | "")} className={`mt-2 ${fieldClass}`}>
            <option value="">공통 / 미지정</option>{Object.entries(EXAM_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-text-hint">학교 공통 자료는 학교명을 비워두고, 학년·시험 구분을 미지정으로 등록할 수 있습니다.</p>
      <label htmlFor="resource-file" className="mt-5 block text-sm font-medium">{editing ? "교체할 PDF 파일 · 선택 사항 · 최대 50MB" : "PDF 파일 · 최대 50MB"}</label>
      <input ref={fileRef} id="resource-file" disabled={busy} type="file" accept=".pdf,application/pdf" required={!editing} onChange={(e) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
        if (!editing) setTitle(selected?.name.replace(/\.pdf$/i, "").slice(0, 100) ?? "");
      }} className="mt-2 block min-w-0 w-full rounded-lg border border-border bg-white p-3 text-sm" />
      <label htmlFor="resource-title" className="mt-5 block text-sm font-medium">자료 제목</label>
      <input id="resource-title" disabled={busy} type="text" required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026년 2학기 국어 내신 분석" className={`mt-2 ${fieldClass}`} />
      <p className="mt-2 text-xs text-text-hint">{editing ? "교체 파일을 선택해도 자료 제목은 유지됩니다. 원하는 제목으로 수정할 수 있습니다." : "파일명에서 자동으로 채워지며, 원하는 제목으로 수정할 수 있습니다."}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="submit" disabled={busy || (!file && !editing) || !title.trim()} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "처리 중..." : editing ? "수정 저장" : "자료 등록"}</button>
        {editing && <button type="button" disabled={busy} onClick={cancelEdit} className="rounded-lg border border-border px-5 py-2.5 text-sm disabled:opacity-50">수정 취소</button>}
      </div>
      {message && <p role="status" className="mt-3 text-sm text-text-sub">{message}</p>}
    </form>

    <div className="mt-9">
      <ResourceLibrary refreshKey={reload} busy={busy} editing={Boolean(editing)} actionMessage={listMessage} onEdit={edit} onRemove={remove} onFormNavigate={navigateToForm} />
    </div>
  </section>;
}
