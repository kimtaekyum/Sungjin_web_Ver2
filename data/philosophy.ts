export interface Philosophy {
  keyword: string;
  description: string;
  icon: string;
}

export const philosophies: Philosophy[] = [
  {
    keyword: "당일 완벽 흡수",
    description:
      "첨삭실 1대1 밀착 지도를 통해 수업 시간에 배운 내용을 완벽히 이해할 때까지 반복 설명합니다.",
    icon: "book-open",
  },
  {
    keyword: "원리부터 깨우치기",
    description:
      "국·영·수 모든 과목에서 무조건적인 암기를 지양하고, 백지 테스트와 구조 분석으로 스스로 생각하는 힘을 키웁니다.",
    icon: "lightbulb",
  },
  {
    keyword: "집중력 훈련",
    description:
      "본인이 마쳐야 할 과제에 온전히 집중하는 훈련으로 태도와 성실함을 근본적으로 변화시킵니다.",
    icon: "bullseye",
  },
  {
    keyword: "장기 로드맵",
    description:
      "초등부터 고등까지 연계된 커리큘럼으로 변화하는 교육 과정에 맞춰 성공적인 대학 진학을 준비합니다.",
    icon: "clipboard-list",
  },
];
