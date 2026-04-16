"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FaIcon from "@/components/ui/FaIcon";
import { AdminCardListSkeleton } from "@/components/ui/Skeleton";
import { supabase } from "@/lib/supabase";
import { getNotices, addNotice, updateNotice, deleteNotice, type Notice } from "@/lib/notices";
import { getEvents, addEvent, updateEvent, deleteEvent } from "@/lib/events";
import {
  getConsultations,
  updateConsultationStatus,
  deleteConsultation,
  type Consultation,
  type ConsultationStatus,
} from "@/lib/consultations";
import type { AcademyEvent } from "@/data/events";

type Tab = "notices" | "events" | "consultations";

const STATUS_LABEL: Record<ConsultationStatus, string> = {
  new: "신규",
  contacted: "연락 완료",
  enrolled: "등록",
  declined: "보류",
};

const STATUS_STYLE: Record<ConsultationStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-blue-50 text-blue-700",
  enrolled: "bg-green-50 text-green-700",
  declined: "bg-gray-100 text-gray-600",
};

// 공지 본문에서 "원문 보기: <URL>" 블록을 분리/합치는 헬퍼
// - splitSourceUrl: 저장된 content → 표시용 body와 sourceUrl 분리 (수정 진입 시 사용)
// - mergeSourceUrl: body + sourceUrl → 저장용 content (제출 시 사용)
const SOURCE_URL_REGEX = /\n*원문\s*보기\s*[:：]\s*(https?:\/\/\S+)\s*$/;

function splitSourceUrl(content: string): { body: string; sourceUrl: string } {
  const match = content.match(SOURCE_URL_REGEX);
  if (!match) return { body: content, sourceUrl: "" };
  return {
    body: content.replace(SOURCE_URL_REGEX, "").trimEnd(),
    sourceUrl: match[1],
  };
}

function mergeSourceUrl(body: string, sourceUrl: string): string {
  const trimmed = body.trimEnd();
  const url = sourceUrl.trim();
  if (!url) return trimmed;
  return trimmed ? `${trimmed}\n\n원문 보기: ${url}` : `원문 보기: ${url}`;
}

export default function AdminPage() {
  // Supabase Auth 세션 기반. null = 미확인(초기 로딩), false = 비로그인, true = 로그인됨.
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("notices");

  // Notices state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", content: "", pinned: false, sourceUrl: "" });
  const [urlError, setUrlError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [faqOpen, setFaqOpen] = useState(false);

  // Events state
  const [events, setEvents] = useState<AcademyEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", startDate: "", endDate: "" });

  // Consultations state
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    const data = await getNotices();
    setNotices(data);
    setLoading(false);
  }, []);

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    const data = await getEvents();
    setEvents(data);
    setLoadingEvents(false);
  }, []);

  const loadConsultations = useCallback(async () => {
    setLoadingConsultations(true);
    const data = await getConsultations();
    setConsultations(data);
    setLoadingConsultations(false);
  }, []);

  // 초기 진입: 저장된 세션 확인 + 이후 로그인/로그아웃 이벤트 구독
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authenticated === true) {
      loadNotices();
      loadEvents();
      loadConsultations();
    }
  }, [authenticated, loadNotices, loadEvents, loadConsultations]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoggingIn(false);
    if (error) {
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    // onAuthStateChange가 authenticated를 true로 바꿔줌
    setPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // onAuthStateChange가 authenticated를 false로 바꿔줌
  };

  // ===== Notice handlers =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    // URL 검증: 비어있으면 OK, 있으면 http(s)://로 시작해야 함
    const url = form.sourceUrl.trim();
    if (url && !/^https?:\/\/\S+$/.test(url)) {
      setUrlError("http:// 또는 https://로 시작하는 유효한 URL을 입력해주세요.");
      return;
    }
    setUrlError(null);

    const payload = {
      title: form.title,
      content: mergeSourceUrl(form.content, url),
      pinned: form.pinned,
    };

    if (editingId) {
      await updateNotice(editingId, payload);
    } else {
      await addNotice(payload);
    }
    await loadNotices();
    setForm({ title: "", content: "", pinned: false, sourceUrl: "" });
    setEditingId(null);
  };

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.id);
    const { body, sourceUrl } = splitSourceUrl(notice.content);
    setForm({ title: notice.title, content: body, pinned: notice.pinned, sourceUrl });
    setUrlError(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 공지사항을 삭제하시겠습니까?")) return;
    await deleteNotice(id);
    await loadNotices();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", content: "", pinned: false, sourceUrl: "" });
    setUrlError(null);
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/sync-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_SYNC_SECRET }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSyncMessage({ type: "error", text: data.error || "동기화 실패" });
        return;
      }

      const errorSuffix = data.errors?.length ? ` (오류 ${data.errors.length}건)` : "";
      setSyncMessage({
        type: "success",
        text: `${data.imported}개 공지사항 생성, ${data.skipped}개 이미 처리됨${errorSuffix}`,
      });
      await loadNotices();
    } catch (err) {
      setSyncMessage({
        type: "error",
        text: err instanceof Error ? err.message : "동기화 실패",
      });
    } finally {
      setSyncing(false);
    }
  };

  // ===== Event handlers =====
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.startDate) return;

    if (eventForm.endDate && eventForm.endDate < eventForm.startDate) {
      alert("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }

    if (editingEventId) {
      await updateEvent(editingEventId, {
        title: eventForm.title,
        startDate: eventForm.startDate,
        endDate: eventForm.endDate || null,
      });
    } else {
      await addEvent({
        title: eventForm.title,
        startDate: eventForm.startDate,
        endDate: eventForm.endDate || undefined,
      });
    }
    await loadEvents();
    setEventForm({ title: "", startDate: "", endDate: "" });
    setEditingEventId(null);
  };

  const handleEventEdit = (ev: AcademyEvent) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      startDate: ev.startDate,
      endDate: ev.endDate || "",
    });
  };

  const handleEventDelete = async (id: string) => {
    if (!confirm("이 일정을 삭제하시겠습니까?")) return;
    await deleteEvent(id);
    await loadEvents();
  };

  const handleEventCancel = () => {
    setEditingEventId(null);
    setEventForm({ title: "", startDate: "", endDate: "" });
  };

  // ===== Consultation handlers =====
  const handleConsultationStatus = async (id: number, status: ConsultationStatus) => {
    await updateConsultationStatus(id, status);
    await loadConsultations();
  };

  const handleConsultationDelete = async (id: number) => {
    if (!confirm("이 상담 신청을 삭제하시겠습니까?")) return;
    await deleteConsultation(id);
    await loadConsultations();
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${y}.${m}.${d}`;
  };

  const formatConsultationDate = (iso: string) => {
    const d = new Date(iso);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${d.getFullYear()}.${mm}.${dd} ${hh}:${mi}`;
  };

  const newConsultationCount = consultations.filter((c) => c.status === "new").length;

  // 초기 세션 확인 중 — 로그인 폼이 깜빡 보이는 것을 방지
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <FaIcon name="spinner" className="w-6 h-6 text-text-hint animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-xl bg-surface border border-border/50 p-8">
            <h1 className="text-xl font-medium text-[#444444] mb-1 text-center">관리자 로그인</h1>
            <p className="text-sm text-text-sub text-center mb-6">성진학원 관리자 페이지</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">이메일</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (loginError) setLoginError(null); }}
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all ${
                    loginError ? "border-danger focus:border-danger" : "border-border focus:border-primary"
                  }`}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">비밀번호</label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (loginError) setLoginError(null); }}
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all ${
                    loginError ? "border-danger focus:border-danger" : "border-border focus:border-primary"
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
                {loginError && (
                  <p className="mt-1.5 text-xs text-danger">{loginError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-lg bg-primary text-white py-3 text-sm font-medium hover:bg-[#8A1519] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loggingIn ? (
                  <>
                    <FaIcon name="spinner" className="w-3.5 h-3.5 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentCount =
    activeTab === "notices"
      ? notices.length
      : activeTab === "events"
      ? events.length
      : consultations.length;
  const currentTitle =
    activeTab === "notices"
      ? "공지사항 관리"
      : activeTab === "events"
      ? "학사일정 관리"
      : "상담 신청 관리";

  // Admin dashboard
  return (
    <div className="min-h-screen bg-bg md:pt-[72px]">
      {/* Admin header */}
      <div className="bg-surface border-b border-border/50">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-5 md:py-0 md:h-20 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base md:text-lg font-medium text-[#444444] truncate">{currentTitle}</h1>
            <span className="text-[11px] md:text-xs text-text-hint bg-bg px-2 py-0.5 rounded-full shrink-0">{currentCount}개</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {activeTab === "notices" && (
              <>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-[13px] md:text-sm font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="네이버 블로그 최신 글을 AI로 요약하여 공지사항으로 등록"
                >
                  <FaIcon name={syncing ? "spinner" : "sync"} className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "동기화 중..." : "블로그 동기화"}
                </button>
                <button
                  type="button"
                  onClick={() => setFaqOpen(true)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-hint hover:text-primary hover:bg-bg transition-colors cursor-pointer"
                  title="블로그 동기화 도움말 FAQ"
                  aria-label="도움말 열기"
                >
                  <FaIcon name="circle-question" className="w-4 h-4" />
                </button>
              </>
            )}
            <Link href="/" className="text-[13px] md:text-sm text-text-sub hover:text-primary transition-colors ml-auto md:ml-0">
              <span className="md:hidden">← 홈</span>
              <span className="hidden md:inline">홈으로 돌아가기</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] md:text-sm text-text-sub hover:text-primary hover:border-primary/30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="로그아웃"
            >
              <FaIcon name="right-from-bracket" className="w-3.5 h-3.5" />
              <span className="hidden md:inline">로그아웃</span>
            </button>
          </div>
        </div>

        {/* Tabs (full-width border top for consistent divider) */}
        <div className="border-t border-border/30">
          <div className="mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="flex gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("notices")}
              className={`py-4 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                activeTab === "notices"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-sub hover:text-text"
              }`}
            >
              공지사항
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`py-4 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
                activeTab === "events"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-sub hover:text-text"
              }`}
            >
              학사일정
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("consultations")}
              className={`py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "consultations"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-sub hover:text-text"
              }`}
            >
              상담 신청
              {newConsultationCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-primary text-white">
                  {newConsultationCount}
                </span>
              )}
            </button>
            </div>
          </div>
        </div>

        {syncMessage && activeTab === "notices" && (
          <div className="mx-auto max-w-[1200px] px-4 md:px-6 pb-3 pt-3">
            <div
              className={`rounded-lg px-4 py-2.5 text-sm flex items-center justify-between gap-3 ${
                syncMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <span>{syncMessage.text}</span>
              <button
                type="button"
                onClick={() => setSyncMessage(null)}
                className="text-current/60 hover:text-current cursor-pointer"
                aria-label="닫기"
              >
                <FaIcon name="xmark" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-10 md:py-12">
        {activeTab === "notices" ? (
          <div className="grid gap-8 md:grid-cols-[380px_1fr]">
            {/* Notice form */}
            <div>
              <div className="rounded-xl bg-surface border border-border/50 p-6 sticky top-24">
                <h2 className="text-base font-medium text-[#444444] mb-4">
                  {editingId ? "공지사항 수정" : "새 공지사항"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">제목 *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="공지사항 제목"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">내용</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                      placeholder="공지 내용을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      원문 URL <span className="text-text-hint font-normal">(선택)</span>
                    </label>
                    <input
                      type="url"
                      value={form.sourceUrl}
                      onChange={(e) => {
                        setForm({ ...form, sourceUrl: e.target.value });
                        if (urlError) setUrlError(null);
                      }}
                      className={`w-full rounded-lg border bg-bg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                        urlError
                          ? "border-primary focus:border-primary focus:ring-primary/10"
                          : "border-border focus:border-primary focus:ring-primary/10"
                      }`}
                      placeholder="https://blog.naver.com/..."
                    />
                    {urlError ? (
                      <p className="text-xs text-primary mt-1">{urlError}</p>
                    ) : (
                      <p className="text-xs text-text-hint mt-1">
                        입력하면 공지 하단에 <span className="font-medium">&ldquo;원문 보기&rdquo;</span> 버튼이 자동으로 표시됩니다.
                      </p>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.pinned}
                      onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                    />
                    <span className="text-sm text-text-sub">상단 고정</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:bg-[#8A1519] transition-colors cursor-pointer"
                    >
                      {editingId ? "수정 완료" : "등록"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-sub hover:bg-bg transition-colors cursor-pointer"
                      >
                        취소
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Notice list */}
            <div>
              {loading ? (
                <AdminCardListSkeleton count={4} />
              ) : notices.length === 0 ? (
                <div className="rounded-xl bg-surface border border-border/50 p-12 text-center">
                  <div className="text-text-hint mb-3">
                    <FaIcon name="clipboard-list" className="w-10 h-10 mx-auto" />
                  </div>
                  <p className="text-text-sub text-sm">등록된 공지사항이 없습니다.</p>
                  <p className="text-text-hint text-xs mt-1">왼쪽 폼에서 새 공지사항을 등록해주세요.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className={`rounded-xl bg-surface border p-5 ${
                        notice.pinned ? "border-primary/30 bg-[#FDF2F2]" : "border-border/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {notice.pinned && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                고정
                              </span>
                            )}
                            <h3 className="text-[15px] font-medium text-[#444444] truncate">
                              {notice.title}
                            </h3>
                          </div>
                          {notice.content && (
                            <p className="text-sm text-text-sub line-clamp-2 mt-1">{notice.content}</p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="md:hidden flex gap-1">
                              <button
                                onClick={() => handleEdit(notice)}
                                className="p-2 rounded-lg text-text-hint hover:text-primary hover:bg-bg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                aria-label="공지사항 수정"
                              >
                                <FaIcon name="pencil" className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(notice.id)}
                                className="p-2 rounded-lg text-text-hint hover:text-danger hover:bg-[#FDF2F2] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                aria-label="공지사항 삭제"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-xs text-text-hint">
                              {new Date(notice.created_at).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="hidden md:flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEdit(notice)}
                            className="p-2 rounded-lg text-text-hint hover:text-primary hover:bg-bg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="공지사항 수정"
                          >
                            <FaIcon name="pencil" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(notice.id)}
                            className="p-2 rounded-lg text-text-hint hover:text-danger hover:bg-[#FDF2F2] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="공지사항 삭제"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "events" ? (
          <div className="grid gap-8 md:grid-cols-[380px_1fr]">
            {/* Event form */}
            <div>
              <div className="rounded-xl bg-surface border border-border/50 p-6 sticky top-24">
                <h2 className="text-base font-medium text-[#444444] mb-4">
                  {editingEventId ? "일정 수정" : "새 일정 등록"}
                </h2>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">일정 제목 *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="예: 중간고사 대비 특강"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">시작일 *</label>
                    <input
                      type="date"
                      required
                      value={eventForm.startDate}
                      onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      종료일 <span className="text-text-hint font-normal">(선택 · 하루 일정이면 비워두세요)</span>
                    </label>
                    <input
                      type="date"
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                      min={eventForm.startDate || undefined}
                      className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:bg-[#8A1519] transition-colors cursor-pointer"
                    >
                      {editingEventId ? "수정 완료" : "등록"}
                    </button>
                    {editingEventId && (
                      <button
                        type="button"
                        onClick={handleEventCancel}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-sub hover:bg-bg transition-colors cursor-pointer"
                      >
                        취소
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Event list */}
            <div>
              {loadingEvents ? (
                <AdminCardListSkeleton count={4} />
              ) : events.length === 0 ? (
                <div className="rounded-xl bg-surface border border-border/50 p-12 text-center">
                  <div className="text-text-hint mb-3">
                    <FaIcon name="bullseye" className="w-10 h-10 mx-auto" />
                  </div>
                  <p className="text-text-sub text-sm">등록된 일정이 없습니다.</p>
                  <p className="text-text-hint text-xs mt-1">왼쪽 폼에서 새 일정을 등록해주세요.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-xl bg-surface border border-border/50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-medium text-[#444444] truncate">
                            {ev.title}
                          </h3>
                          <p className="text-xs text-text-hint mt-2">
                            {ev.endDate && ev.endDate !== ev.startDate
                              ? `${formatDateDisplay(ev.startDate)} ~ ${formatDateDisplay(ev.endDate)}`
                              : formatDateDisplay(ev.startDate)}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => handleEventEdit(ev)}
                            className="p-2 rounded-lg text-text-hint hover:text-primary hover:bg-bg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="일정 수정"
                          >
                            <FaIcon name="pencil" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEventDelete(ev.id)}
                            className="p-2 rounded-lg text-text-hint hover:text-danger hover:bg-[#FDF2F2] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label="일정 삭제"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // ===== Consultations tab =====
          <div>
            {loadingConsultations ? (
              <AdminCardListSkeleton count={3} />
            ) : consultations.length === 0 ? (
              <div className="rounded-xl bg-surface border border-border/50 p-12 text-center">
                <div className="text-text-hint mb-3">
                  <FaIcon name="comments" className="w-10 h-10 mx-auto" />
                </div>
                <p className="text-text-sub text-sm">아직 접수된 상담 신청이 없습니다.</p>
                <p className="text-text-hint text-xs mt-1">
                  상담 페이지에서 신청이 들어오면 이곳에 표시됩니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-xl bg-surface border p-5 ${
                      c.status === "new" ? "border-primary/30" : "border-border/50"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ${STATUS_STYLE[c.status]}`}
                          >
                            {STATUS_LABEL[c.status]}
                          </span>
                          <div className="flex items-baseline gap-1.5 min-w-0">
                            <h3 className="text-[15px] font-medium text-[#444444] truncate">
                              {c.parent_name}
                            </h3>
                            <span className="text-xs text-text-sub whitespace-nowrap">
                              {c.grade === "초등"
                                ? "초등학생"
                                : c.grade === "중등"
                                ? "중학생"
                                : "고등학생"}{" "}
                              학부모
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-x-3 gap-y-1 text-sm flex-wrap">
                          <a
                            href={`tel:${c.phone}`}
                            className="text-primary hover:underline font-medium whitespace-nowrap"
                          >
                            {c.phone_display}
                          </a>
                          {c.subjects.length > 0 && (
                            <span className="text-text-sub whitespace-nowrap">
                              과목: {c.subjects.join(", ")}
                            </span>
                          )}
                          {c.preferred_time && (
                            <span className="text-text-sub">
                              희망 시간: {c.preferred_time}
                            </span>
                          )}
                        </div>
                        {c.memo && (
                          <p className="text-sm text-text-sub bg-bg rounded-lg px-3 py-2 whitespace-pre-wrap">
                            {c.memo}
                          </p>
                        )}
                        <p className="text-xs text-text-hint">
                          접수: {formatConsultationDate(c.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleConsultationStatus(c.id, e.target.value as ConsultationStatus)
                          }
                          className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 cursor-pointer"
                          aria-label="상담 상태 변경"
                        >
                          <option value="new">신규</option>
                          <option value="contacted">연락 완료</option>
                          <option value="enrolled">등록</option>
                          <option value="declined">보류</option>
                        </select>
                        <button
                          onClick={() => handleConsultationDelete(c.id)}
                          className="p-2 rounded-lg text-text-hint hover:text-danger hover:bg-[#FDF2F2] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label="상담 삭제"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      {faqOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setFaqOpen(false)}
        >
          <div
            className="bg-surface rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] flex items-center justify-center text-primary">
                  <FaIcon name="circle-question" className="w-4 h-4" />
                </div>
                <h2 className="text-base font-medium text-[#444444]">블로그 동기화 도움말</h2>
              </div>
              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="p-2 rounded-lg text-text-hint hover:text-text hover:bg-bg transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <FaIcon name="xmark" className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-5 space-y-3">
              <p className="text-sm text-text-sub mb-3">
                네이버 블로그에 글을 올린 뒤 <strong className="text-primary">블로그 동기화</strong> 버튼을 누르면 AI가 자동으로 학부모용 공지를 생성합니다. 자주 묻는 질문을 확인해보세요.
              </p>

              <details className="group rounded-lg border border-border/50 bg-bg overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none hover:bg-surface transition-colors">
                  <span className="text-sm font-medium text-text flex-1">
                    Q1. 버튼 눌렀는데 &quot;0개 생성, 5개 이미 처리됨&quot;으로 나와요
                  </span>
                  <FaIcon name="chevron-down" className="w-3 h-3 text-text-hint shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-1 text-sm text-text-sub leading-relaxed">
                  <p>정상입니다. 새로 올라온 블로그 글이 없다는 뜻이에요.</p>
                  <p className="mt-2">
                    블로그에 글 새로 올리신 후 <strong>약 1시간 뒤</strong> 다시 시도해주세요. (네이버 RSS 반영 대기 시간)
                  </p>
                </div>
              </details>

              <details className="group rounded-lg border border-border/50 bg-bg overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none hover:bg-surface transition-colors">
                  <span className="text-sm font-medium text-text flex-1">
                    Q2. AI가 만든 요약이 마음에 안 들어요
                  </span>
                  <FaIcon name="chevron-down" className="w-3 h-3 text-text-hint shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-1 text-sm text-text-sub leading-relaxed">
                  <p>
                    공지 목록에서 해당 항목의 <strong>연필(수정) 아이콘</strong>을 눌러 제목·내용을 직접 편집할 수 있습니다. 또는 <strong>휴지통(삭제) 아이콘</strong>으로 지운 뒤 직접 작성하셔도 됩니다.
                  </p>
                  <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                    ⚠️ <strong>주의:</strong> 공지를 삭제해도 동기화 기록은 남아있어서, <strong>다시 &quot;블로그 동기화&quot; 버튼을 눌러도 자동으로 복구되지 않습니다.</strong> (&quot;이 글은 공지로 올리고 싶지 않다&quot;는 의사를 존중하는 설계)
                  </div>
                </div>
              </details>

              <details className="group rounded-lg border border-border/50 bg-bg overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none hover:bg-surface transition-colors">
                  <span className="text-sm font-medium text-text flex-1">
                    Q3. 블로그에 올린 글이 공지에 안 나타나요
                  </span>
                  <FaIcon name="chevron-down" className="w-3 h-3 text-text-hint shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-1 text-sm text-text-sub leading-relaxed">
                  <p className="mb-2">가능한 원인 3가지:</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>
                      <strong>네이버 RSS 캐시</strong> — 네이버가 아직 RSS에 새 글을 반영하지 않음. <strong>1시간 더</strong> 기다리기.
                    </li>
                    <li>
                      <strong>우리 서버 캐시</strong> — 서버는 1시간에 한 번만 RSS를 새로 읽음. <strong>1시간 후</strong> 재시도.
                    </li>
                    <li>
                      <strong>AI 오류</strong> — 매우 드물지만 Claude API 장애 시 결과 메시지의 <code className="bg-bg px-1 rounded text-xs">오류 N건</code>으로 표시됨.
                    </li>
                  </ol>
                </div>
              </details>

              <details className="group rounded-lg border border-border/50 bg-bg overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none hover:bg-surface transition-colors">
                  <span className="text-sm font-medium text-text flex-1">
                    Q4. 5개보다 많은 블로그 글을 한 번에 처리하려면?
                  </span>
                  <FaIcon name="chevron-down" className="w-3 h-3 text-text-hint shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-1 text-sm text-text-sub leading-relaxed">
                  <p>
                    네이버 RSS는 <strong>최신 글 5개만</strong> 외부에 공개합니다. 더 오래된 글은 자동화 대상이 아니에요.
                  </p>
                  <p className="mt-2">
                    예전 블로그 글을 공지로 올리고 싶으시다면, 왼쪽 &quot;새 공지사항&quot; 폼에서 직접 작성해주세요.
                  </p>
                </div>
              </details>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-3 border-t border-border/50 bg-bg shrink-0">
              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="w-full rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:bg-[#8A1519] transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
