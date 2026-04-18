import { ACADEMY_INFO } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: ACADEMY_INFO.name,
    description: ACADEMY_INFO.description,
    url: SITE_URL,
    telephone: ACADEMY_INFO.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "오목로 15 지우빌딩 301, 401호",
      addressLocality: "양천구",
      addressRegion: "서울",
      addressCountry: "KR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "13:00",
      closes: "22:00",
    },
    sameAs: [ACADEMY_INFO.kakaoLink],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
