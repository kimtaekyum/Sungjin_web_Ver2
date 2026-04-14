"use client";

import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS, ACADEMY_INFO } from "@/lib/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-[#2C2C2A]/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-surface shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/50">
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

        <nav className="flex flex-col p-5 gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="rounded-xl px-4 py-3.5 text-[15px] font-medium text-text hover:bg-bg transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
