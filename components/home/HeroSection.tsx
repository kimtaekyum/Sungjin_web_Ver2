import Button from "@/components/ui/Button";
import FaIcon from "@/components/ui/FaIcon";
import { ACADEMY_INFO } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative bg-[#2C2C2A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2A] via-[#3a3a38] to-[#2C2C2A]" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Glow effects */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#B81D22]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#D4A84B]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-wide">
                신월동 30년 전통 입시 전문 학원
              </span>
            </div>
            <h1 className="text-[30px] font-medium leading-[1.2] text-white sm:text-[40px] md:text-[52px] md:leading-[1.15]">
              대학 잘 보내는
              <br />
              <span className="text-[#FF6B6B]">1대1 맞춤 첨삭</span> 전문
              <br />
              성진학원
            </h1>
            <p className="mt-5 text-white/60 text-[15px] leading-relaxed md:text-lg md:mt-7 max-w-lg">
              {ACADEMY_INFO.subSlogan}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
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

          {/* Visual: Info cards */}
          <div className="hidden md:block relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Large card top-left */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 row-span-2 flex flex-col justify-end min-h-[280px]">
                <div className="text-white/80 mb-3">
                  <FaIcon name="graduation-cap" className="w-10 h-10" />
                </div>
                <p className="text-white font-medium text-lg">2026학년도</p>
                <p className="text-[#D4A84B] font-medium text-2xl">서울대 합격</p>
              </div>
              {/* Small card top-right */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 flex flex-col justify-center">
                <div className="text-white/80 mb-2">
                  <FaIcon name="pencil" className="w-6 h-6" />
                </div>
                <p className="text-white/90 font-medium text-sm">1대1 밀착 첨삭</p>
                <p className="text-white/60 text-xs mt-1">개념 완벽 흡수 시스템</p>
              </div>
              {/* Small card bottom-right */}
              <div className="rounded-2xl bg-primary/20 backdrop-blur-sm p-5 flex flex-col justify-center">
                <div className="text-white/80 mb-2">
                  <FaIcon name="chart-column" className="w-6 h-6" />
                </div>
                <p className="text-white/90 font-medium text-sm">초4 ~ 고3</p>
                <p className="text-white/60 text-xs mt-1">국·영·수 전 과목</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
