"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, ACADEMY_INFO } from "@/lib/constants";
import MobileNav from "./MobileNav";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solid = scrolled || isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-surface/95 backdrop-blur-md shadow-sm ${
        solid
          ? ""
          : "md:bg-transparent md:shadow-none md:-translate-y-full md:opacity-0 md:pointer-events-none"
      }`}
    >
      {/* Main nav */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 flex h-16 items-center justify-between md:h-[72px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo@2x.png"
            alt={ACADEMY_INFO.name}
            width={160}
            height={37}
            className="h-8 w-auto md:h-9 transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium tracking-wide text-text hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
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
          className="md:hidden p-2 cursor-pointer"
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
