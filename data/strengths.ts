export interface Strength {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const strengths: Strength[] = [
  {
    id: 1,
    title: "대입 세미나",
    description:
      "매년 입시 정책 변화와 주변 고등학교 특성을 분석하는 세미나를 진행합니다.",
    icon: "graduation-cap",
  },
  {
    id: 2,
    title: "1대1 밀착 첨삭",
    description:
      "강의 전후 첨삭실에서 1대1 문제 풀이로 개념을 완벽히 자기 것으로 만듭니다.",
    icon: "pencil",
  },
  {
    id: 3,
    title: "클래스톡톡",
    description:
      "매일 담당 선생님이 카톡으로 출결·숙제·진도를 안내드립니다.",
    icon: "comments",
  },
  {
    id: 4,
    title: "초-중-고 로드맵",
    description:
      "장기적 학습 커리큘럼과 학생 개인별 1:1 상담으로 약점을 보완합니다.",
    icon: "map-location-dot",
  },
  {
    id: 5,
    title: "개념 백지 테스트",
    description:
      "수학 백지 테스트로 개념 이해도를 점검하고 부족한 빈틈을 채웁니다.",
    icon: "file-lines",
  },
  {
    id: 6,
    title: "동기부여",
    description:
      "명확한 목표 제시와 함께 학습 의지를 북돋고 집중력·성실함을 배양합니다.",
    icon: "fire",
  },
];
