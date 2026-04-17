import SectionTitle from "@/components/ui/SectionTitle";
import FaIcon from "@/components/ui/FaIcon";
import { strengths } from "@/data/strengths";

export default function StrengthCards() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionTitle
          title={<>성진학원 <span className="text-primary">6가지 강점</span></>}
          subtitle={<>학생의 <span className="text-primary">성장</span>을 위한 체계적인 교육 시스템</>}
        />
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((s) => (
            <div
              key={s.id}
              className="group rounded-xl bg-surface border border-border/50 p-7 hover:border-[#9F9E9E] transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#FDF2F2] flex items-center justify-center text-primary">
                  <FaIcon name={s.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#444444] mb-2 md:text-lg">
                    {s.title}
                  </h3>
                  <p className="text-sm text-text-sub leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
