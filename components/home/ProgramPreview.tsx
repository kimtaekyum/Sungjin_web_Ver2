import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import FaIcon from "@/components/ui/FaIcon";
import { programs } from "@/data/programs";

const icons = ["ruler", "book", "bullseye"];

export default function ProgramPreview() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <SectionTitle
          title="교육과정 안내"
          subtitle={<>초등부부터 고등부까지, 단계별 <span className="text-primary">맞춤</span> 교육</>}
        />
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {programs.map((p, idx) => (
            <div
              key={p.slug}
              className="group rounded-xl bg-surface overflow-hidden border border-border/50 hover:border-[#9F9E9E] transition-all duration-200"
            >
              <div className="p-7 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#FDF2F2] flex items-center justify-center text-primary">
                    <FaIcon name={icons[idx]} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-[#444444]">
                      {p.title}
                    </h3>
                    <span className="text-xs text-text-sub">{p.target}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-[#FDF2F2] px-3 py-1 text-xs font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2.5 mb-7">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-text-sub leading-relaxed">
                      <svg className="h-4 w-4 mt-0.5 shrink-0 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="ghost"
                  href="/contact"
                  className="w-full text-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                >
                  {p.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
