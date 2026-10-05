"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, ACADEMY_INFO, isNavActive } from "@/lib/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shown || !open) return;
    const previousFocus = document.activeElement;
    drawerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.getClientRects().length) previousFocus.focus();
    };
  }, [shown, open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => { if (desktop.matches) onClose(); };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      let shownFrame = 0;
      const mountedFrame = requestAnimationFrame(() => {
        setMounted(true);
        shownFrame = requestAnimationFrame(() => setShown(true));
      });
      return () => { cancelAnimationFrame(mountedFrame); cancelAnimationFrame(shownFrame); };
    }
    const frame = requestAnimationFrame(() => { setShown(false); setResourcesOpen(false); });
    const t = setTimeout(() => setMounted(false), 300);
    return () => { cancelAnimationFrame(frame); clearTimeout(t); };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-[#2C2C2A]/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          shown ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="사이트 메뉴"
        aria-modal="true"
        aria-hidden={!open}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const targets = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).filter((target) => target.getClientRects().length > 0);
          if (!targets?.length) return;
          const first = targets[0];
          const last = targets[targets.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }}
        className={`fixed top-0 right-0 z-50 flex h-dvh w-80 max-w-[85vw] flex-col bg-surface shadow-2xl transition-transform duration-300 xl:hidden ${
          shown ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between p-5 border-b border-border/50">
          <Image
            src="/images/logo@2x.png"
            alt={ACADEMY_INFO.name}
            width={120}
            height={28}
            className="h-7 w-auto"
          />
          <button onClick={onClose} className="p-2 cursor-pointer rounded-full hover:bg-bg transition-colors" aria-label="메뉴 닫기">
            <svg className="h-5 w-5 text-text-hint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav aria-label="모바일 주 메뉴" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-5 gap-1">
          {NAV_ITEMS.map((item) => {
            if ("href" in item) {
              const active = isNavActive(pathname, item.href);
              return <Link key={item.href} href={item.href} onClick={onClose} aria-current={active ? "page" : undefined} className={`rounded-xl px-4 py-3.5 text-[15px] font-medium hover:bg-bg transition-colors ${active ? "bg-bg text-primary" : "text-text"}`}>{item.label}</Link>;
            }
            const active = item.children.some((child) => isNavActive(pathname, child.href));
            return (
              <div key={item.label}>
                <button type="button" aria-expanded={resourcesOpen} aria-controls="mobile-resources" onClick={() => setResourcesOpen(!resourcesOpen)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium cursor-pointer hover:bg-bg transition-colors ${active || resourcesOpen ? "text-primary" : "text-text"}`}>
                  {item.label}
                  <svg aria-hidden="true" className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div id="mobile-resources" hidden={!resourcesOpen} className="ml-4 border-l border-border/50 pl-2">
                  {item.children.map((child) => {
                    const selected = isNavActive(pathname, child.href);
                    return <Link key={child.href} href={child.href} onClick={onClose} aria-current={selected ? "page" : undefined} className={`block rounded-lg px-4 py-3 text-sm font-medium hover:bg-bg transition-colors ${selected ? "bg-bg text-primary" : "text-text-sub"}`}>{child.label}</Link>;
                  })}
                </div>
              </div>
            );
          })}
          <div className="mt-6 pt-6 border-t border-border/50">
            <Link
              href="/contact"
              onClick={onClose}
              className="block rounded-lg bg-primary px-4 py-3.5 text-center text-sm font-medium text-white hover:bg-[#8A1519] transition-colors"
            >
              상담 신청하기
            </Link>
            <a
              href={`tel:${ACADEMY_INFO.phone}`}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-border/50 px-4 py-3 text-sm font-medium text-text-sub hover:bg-bg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {ACADEMY_INFO.phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
