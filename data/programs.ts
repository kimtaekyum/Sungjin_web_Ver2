export interface Program {
  slug: string;
  title: string;
  target: string;
  subjects: string[];
  description: string;
  highlights: string[];
  details?: string[];
  tuition: { subject: string; price: string }[];
  ctaText: string;
}

export const programs: Program[] = [
  {
    slug: "elementary",
    title: "초등부",
    target: "초등 4~6학년",
    subjects: ["수학", "영어"],
    description:
      "초등학교 4학년부터 시작하는 초등부는 연산부터 심화까지 수학의 뼈대를 세우고 영어의 기초를 다집니다. 무리한 진도 빼기보다 단계별 성장을 목표로 삼아 학업 집중력을 높입니다. 개념을 완벽히 파악하며 진도를 나가는 공부 습관이 필요한 아이에게 추천합니다.",
    highlights: [
      "연산부터 서술형까지 단계별 성장",
      "매일 카톡 메시지로 출결 및 숙제 관리",
      "집중력이 약해 공부 습관이 필요한 학생",
    ],
    tuition: [
      { subject: "수학", price: "23만원" },
      { subject: "영어", price: "23만원" },
    ],
    ctaText: "초등부 상담받기",
  },
  {
    slug: "middle",
    title: "중등부",
    target: "중1~중3",
    subjects: ["국어", "영어", "수학"],
    description:
      "고등학교 진학을 대비해 스스로 생각하는 힘과 실전 내공을 탄탄하게 키우는 중등 과정입니다. 영어·수학은 1대1 첨삭실 복습 시스템을 거치며 강의실에서 배운 개념을 온전히 자기 것으로 만듭니다. 일반고 진학 후에도 흔들리지 않을 자기주도성이 필요한 학생에게 적합합니다.",
    highlights: [
      "고등 진학 대비 생각하는 힘 기르기",
      "1대1 첨삭으로 배운 개념 완벽 복습",
      "시험 4주 전부터 철저한 학교 내신 대비",
    ],
    tuition: [
      { subject: "수학", price: "26만원" },
      { subject: "영어", price: "26만원" },
      { subject: "국어", price: "15만원" },
    ],
    ctaText: "중등부 상담받기",
  },
  {
    slug: "high",
    title: "고등부",
    target: "고1~고3",
    subjects: ["국어", "영어", "수학"],
    description:
      "내신과 수능을 동시에 완벽하게 대비하여 상위권 대학 합격이라는 결과를 증명하는 입시 전문 과정입니다. 2022 개정 교육과정에 맞춘 로드맵부터 진로 적합성 검사까지 철저히 관리합니다. 변화하는 대입이 불안하거나 명확한 공부 방법을 몰라 헤매는 학생을 이끌어줍니다.",
    highlights: [
      "내신과 수능을 동시 대비하는 입시 전문",
      "시험 6주 전부터 시작하는 밀착 내신 관리",
      "공부 방법을 모르는 학생을 위한 로드맵 제시",
    ],
    tuition: [
      { subject: "수학", price: "36만원" },
      { subject: "영어", price: "36만원" },
      { subject: "국어", price: "26만원" },
    ],
    ctaText: "고등부 상담받기",
  },
  {
    slug: "science-high1",
    title: "고1 통합과학",
    target: "고1",
    subjects: ["통합과학"],
    description:
      "개념부터 시험 대비까지, 고1 통합과학을 체계적인 학습 루틴으로 완성합니다. 배운 내용을 스스로 정리하고 오답을 교정하며, 학교별 교과서에 맞춘 문제로 내신을 준비합니다. 선생님이 직접 자필로 정리해주는 요점노트로 핵심까지 잡아드립니다.",
    highlights: [
      "생각노트 + 오답노트로 학습 완전 체화",
      "학교별 교과서 출판사 맞춤 시험 대비",
      "선생님 자필 요점정리 제공",
    ],
    tuition: [
      { subject: "통합과학", price: "25만원" },
    ],
    ctaText: "통합과학 상담받기",
  },
];
