export interface Notice {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

const STORAGE_KEY = "seongjin_notices";

export function getNotices(): Notice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotices(notices: Notice[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
}

export function addNotice(notice: Omit<Notice, "id" | "createdAt">): Notice {
  const notices = getNotices();
  const newNotice: Notice = {
    ...notice,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  notices.unshift(newNotice);
  saveNotices(notices);
  return newNotice;
}

export function updateNotice(id: string, updates: Partial<Omit<Notice, "id" | "createdAt">>) {
  const notices = getNotices();
  const idx = notices.findIndex((n) => n.id === id);
  if (idx === -1) return;
  notices[idx] = { ...notices[idx], ...updates };
  saveNotices(notices);
}

export function deleteNotice(id: string) {
  const notices = getNotices().filter((n) => n.id !== id);
  saveNotices(notices);
}
