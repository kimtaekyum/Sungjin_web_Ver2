import Link from "next/link";
import Image from "next/image";
import { ACADEMY_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative bg-[#2C2C2A] text-white overflow-hidden">
      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 right-0 h-16 -translate-y-[99%]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 60L0 30C240 60 480 10 720 30C960 50 1200 15 1440 30L1440 60L0 60Z" fill="#2C2C2A" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 pt-10 pb-6 md:pt-12">
        {/* Info row */}
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Image
            src="/images/logo@2x.png"
            alt={ACADEMY_INFO.name}
            width={160}
            height={37}
            className="h-7 w-auto shrink-0"
          />
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-1 text-sm text-white/60">
            <p>{ACADEMY_INFO.address}</p>
            <a href={`tel:${ACADEMY_INFO.phone}`} className="hover:text-white transition-colors">
              {ACADEMY_INFO.phone}
            </a>
            <p className="text-white/40 text-xs">{ACADEMY_INFO.registrationNo}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {ACADEMY_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
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
