import FaIcon from "@/components/ui/FaIcon";
import Button from "@/components/ui/Button";
import { ACADEMY_INFO } from "@/lib/constants";

export default function QuickConsult() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          {/* Left: Map + Info */}
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-text-hint mb-4">
              오시는 길
            </p>
            <h2 className="text-[22px] font-medium text-[#444444] mb-6 md:text-3xl">
              성진학원을 방문해주세요
            </h2>

            {/* Map link */}
            <a
              href={ACADEMY_INFO.naverMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden bg-bg min-h-[240px] flex items-center justify-center mb-6 border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="text-center p-8">
                <div className="text-primary mb-3">
                  <FaIcon name="location-dot" className="w-10 h-10" />
                </div>
                <p className="text-sm font-medium text-text">네이버 지도에서 보기</p>
                <p className="text-xs text-text-hint mt-1">클릭하면 네이버 지도로 이동합니다</p>
              </div>
            </a>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-surface border border-border/50 p-4 text-center">
                <div className="text-primary mb-1">
                  <FaIcon name="location-dot" className="w-5 h-5 mx-auto" />
                </div>
                <p className="text-xs text-text-sub mb-0.5">주소</p>
                <p className="text-[13px] font-medium text-text">{ACADEMY_INFO.address}</p>
              </div>
              <div className="rounded-xl bg-surface border border-border/50 p-4 text-center">
                <div className="text-primary mb-1">
                  <FaIcon name="phone" className="w-5 h-5 mx-auto" />
                </div>
                <p className="text-xs text-text-sub mb-0.5">전화</p>
                <a href={`tel:${ACADEMY_INFO.phone}`} className="text-[13px] font-medium text-primary hover:underline">
                  {ACADEMY_INFO.phone}
                </a>
              </div>
              <div className="rounded-xl bg-surface border border-border/50 p-4 text-center">
                <div className="text-primary mb-1">
                  <FaIcon name="clock" className="w-5 h-5 mx-auto" />
                </div>
                <p className="text-xs text-text-sub mb-0.5">운영시간</p>
                <p className="text-[13px] font-medium text-text">월~토 13:00–22:00</p>
              </div>
            </div>
          </div>

          {/* Right: CTA to contact page */}
          <div className="rounded-xl bg-surface border border-border/50 p-7 md:p-9 flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-16 h-16 rounded-full bg-[#FDF2F2] flex items-center justify-center mb-5 text-primary">
              <FaIcon name="comments" className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-[#444444] mb-2">
              상담 신청
            </h3>
            <p className="text-sm text-text-sub mb-6 leading-relaxed">
              전화 또는 온라인으로 편하게 상담받으세요.<br />
              학생에게 맞는 맞춤 학습 플랜을 안내해드립니다.
            </p>
            <Button variant="primary" href="/contact" className="rounded-lg px-8">
              상담 신청하기
            </Button>
            <a
              href={`tel:${ACADEMY_INFO.phone}`}
              className="mt-4 text-sm text-text-sub hover:text-primary transition-colors"
            >
              또는 전화: {ACADEMY_INFO.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
