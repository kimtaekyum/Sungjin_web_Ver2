import Link from "next/link";
import Image from "next/image";
import { ACADEMY_INFO, NAV_ITEMS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative bg-[#2C2C2A] text-white overflow-hidden">
      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 right-0 h-16 -translate-y-[99%]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 60L0 30C240 60 480 10 720 30C960 50 1200 15 1440 30L1440 60L0 60Z" fill="#2C2C2A" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 pt-16 pb-8 md:pt-20">
        {/* Top section */}
        <div className="grid gap-10 md:grid-cols-4 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/images/logo@2x.png"
              alt={ACADEMY_INFO.name}
              width={140}
              height={32}
              className="h-8 w-auto mb-3"
            />
            <p className="text-sm text-white/50 leading-relaxed">
              {ACADEMY_INFO.slogan}
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-white/40 mb-4">
              바로가기
            </h4>
            <nav className="flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 학원 정보 */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-white/40 mb-4">
              학원 정보
            </h4>
            <div className="space-y-2.5 text-sm text-white/60">
              <p>{ACADEMY_INFO.address}</p>
              <p className="text-white/40">{ACADEMY_INFO.addressLegacy}</p>
              <p>
                <a href={`tel:${ACADEMY_INFO.phone}`} className="hover:text-white transition-colors">
                  {ACADEMY_INFO.phone}
                </a>
              </p>
              <p>{ACADEMY_INFO.operatingHours}</p>
              <p className="text-white/40">{ACADEMY_INFO.registrationNo}</p>
            </div>
          </div>

          {/* 상담 */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-white/40 mb-4">
              상담
            </h4>
            <p className="text-sm text-white/60 mb-5">
              전화 또는 카카오톡으로<br />편하게 상담받으세요.
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${ACADEMY_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화 상담
              </a>
              <a
                href={ACADEMY_INFO.kakaoLink}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-5 py-2.5 text-sm font-medium text-[#3C1E1E] hover:bg-[#FDD800] transition-colors"
              >
                카카오톡 상담
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {ACADEMY_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <Link href="#" className="hover:text-white/60 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/admin" className="hover:text-white/60 transition-colors">
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
