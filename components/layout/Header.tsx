"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, ACADEMY_INFO, isNavActive, type NavItem } from "@/lib/constants";
import MobileNav from "./MobileNav";

function DesktopNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const dismissOnMobile = () => { if (!desktop.matches) setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    desktop.addEventListener("change", dismissOnMobile);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      desktop.removeEventListener("change", dismissOnMobile);
    };
  }, [open]);

  if ("href" in item) {
    const active = isNavActive(pathname, item.href);
    return <Link href={item.href} aria-current={active ? "page" : undefined} className={`text-[14px] font-medium tracking-wide hover:text-primary transition-colors ${active ? "text-primary" : "text-text"}`}>{item.label}</Link>;
  }

  const active = item.children.some((child) => isNavActive(pathname, child.href));
  return (
    <div ref={containerRef} className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }} onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }}>
      <button ref={buttonRef} type="button" aria-expanded={open} aria-controls="desktop-resources" onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 cursor-pointer text-[14px] font-medium tracking-wide hover:text-primary transition-colors ${active || open ? "text-primary" : "text-text"}`}>
        {item.label}
        <svg aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 9 6 6 6-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div id="desktop-resources" hidden={!open} className="absolute top-full right-0 mt-4 w-44 rounded-xl border border-border/50 bg-surface p-2 shadow-lg">
        {item.children.map((child) => {
          const selected = isNavActive(pathname, child.href);
          return <Link key={child.href} href={child.href} onClick={() => setOpen(false)} aria-current={selected ? "page" : undefined} className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-bg hover:text-primary ${selected ? "bg-bg text-primary" : "text-text"}`}>{child.label}</Link>;
        })}
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-surface/95 backdrop-blur-md shadow-sm"
    >
      {/* Main nav */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 flex h-16 items-center justify-between md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo@2x.png"
            alt={ACADEMY_INFO.name}
            width={800}
            height={185}
            className="h-8 w-auto md:h-9 transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="주 메뉴" className="hidden xl:flex items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <DesktopNavItem key={item.label} item={item} />
          ))}
          <Link
            href="/contact"
            className="ml-2 rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-white hover:bg-[#8A1519] transition-all"
          >
            상담 신청
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="xl:hidden p-2 cursor-pointer"
          aria-label="메뉴 열기"
        >
          <svg
            className="h-6 w-6 text-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

    </header>
    <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
