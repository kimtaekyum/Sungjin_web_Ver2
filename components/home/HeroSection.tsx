import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative bg-[#2C2C2A] overflow-hidden -mt-16 md:mt-0">
      {/* ===== Mobile: 신규 배너 이미지 ===== */}
      <div className="md:hidden relative w-full pt-16">
        <div className="relative w-full aspect-[2323/4193]">
          <Image
            src="/images/hero-banner-mobile.png"
            alt="강의가 끝이 아닌 1대1 맞춤 첨삭, 대학 잘 보내는 성진학원"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* 좌측 하단 CTA */}
          <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-2.5 z-10">
            <Button variant="primary" href="/programs" className="w-full">
              수업 안내 보기
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Desktop: 신규 배너 이미지 ===== */}
      <div className="hidden md:block relative w-full pt-16">
        <div className="relative w-full aspect-[2/1]">
          <Image
            src="/images/hero-banner.png"
            alt="강의가 끝이 아닌 1대1 맞춤 첨삭, 대학 잘 보내는 성진학원"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* 좌측 하단 CTA */}
          <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-16 flex flex-row gap-3 z-10">
            <Button variant="primary" href="/contact">
              상담 신청하기
            </Button>
            <Button
              variant="ghost"
              href="/programs"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30 bg-transparent"
            >
              수업 안내 보기
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
}
