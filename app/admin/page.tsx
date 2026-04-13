"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import FaIcon from "@/components/ui/FaIcon";
import { getNotices, addNotice, updateNotice, deleteNotice, type Notice } from "@/lib/notices";

const ADMIN_PASSWORD = "0000";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", content: "", pinned: false });

  const loadNotices = useCallback(async () => {
    setLoading(true);
    const data = await getNotices();
    setNotices(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadNotices();
    }
  }, [authenticated, loadNotices]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      await updateNotice(editingId, form);
    } else {
      await addNotice(form);
    }
    await loadNotices();
    setForm({ title: "", content: "", pinned: false });
    setEditingId(null);
  };

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setForm({ title: notice.title, content: notice.content, pinned: notice.pinned });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 공지사항을 삭제하시겠습니까?")) return;
    await deleteNotice(id);
    await loadNotices();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", content: "", pinned: false });
  };

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
                <label className="block text-sm font-medium text-text mb-1.5">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all ${
                    passwordError ? "border-danger focus:border-danger" : "border-border focus:border-primary"
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
                {passwordError && (
                  <p className="mt-1.5 text-xs text-danger">비밀번호가 올바르지 않습니다.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary text-white py-3 text-sm font-medium hover:bg-[#8A1519] transition-colors cursor-pointer"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-bg pt-16 md:pt-[72px]">
      {/* Admin header */}
      <div className="bg-surface border-b border-border/50">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium text-[#444444]">공지사항 관리</h1>
            <span className="text-xs text-text-hint bg-bg px-2 py-0.5 rounded-full">{notices.length}개</span>
          </div>
          <Link href="/" className="text-sm text-text-sub hover:text-primary transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-8">
        <div className="grid gap-8 md:grid-cols-[380px_1fr]">
          {/* Form */}
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
              <div className="rounded-xl bg-surface border border-border/50 p-12 text-center">
                <p className="text-text-sub text-sm">불러오는 중...</p>
              </div>
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
                        <p className="text-xs text-text-hint mt-2">
                          {new Date(notice.created_at).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(notice)}
                          className="p-2 rounded-lg text-text-hint hover:text-primary hover:bg-bg transition-colors cursor-pointer"
                          title="수정"
                        >
                          <FaIcon name="pencil" className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-2 rounded-lg text-text-hint hover:text-danger hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                          title="삭제"
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
      </div>
    </div>
  );
}
