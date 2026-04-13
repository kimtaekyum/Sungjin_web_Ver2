import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { admissionResults } from "@/data/results";

export default function AdmissionHighlight() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionTitle
          title="2026학년도 합격 실적"
          subtitle="성진학원의 검증된 입시 결과"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {admissionResults.slice(0, 8).map((r, i) => (
            <div
              key={i}
              className={`group rounded-xl p-6 text-center transition-all duration-200 ${
                r.highlight
                  ? "bg-[#F5E6C4] border border-[#D4A84B]/30"
                  : "bg-surface border border-border/50 hover:border-[#9F9E9E]"
              }`}
            >
              {r.highlight && (
                <div className="inline-flex items-center gap-1 rounded-full bg-[#D4A84B]/20 px-2.5 py-0.5 text-[10px] font-medium text-[#8B6914] mb-3">
                  TOP
                </div>
              )}
              <h3
                className={`text-xl font-medium md:text-2xl ${
                  r.highlight ? "text-[#2C2C2A]" : "text-[#444444]"
                }`}
              >
                {r.university}
              </h3>
              {r.department && (
                <p className={`mt-1.5 text-sm ${r.highlight ? "text-[#6B6A6A]" : "text-text-sub"}`}>
                  {r.department}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="ghost" href="/results">
            더 많은 실적 보기 →
          </Button>
        </div>
      </div>
    </section>
  );
}
