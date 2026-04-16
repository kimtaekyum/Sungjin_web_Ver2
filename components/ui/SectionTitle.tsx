interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <div className={`text-center mb-10 md:mb-14 ${className}`}>
      <h2 className="font-heading text-[22px] font-semibold tracking-tight text-[#444444] md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-text-sub text-[15px] md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
