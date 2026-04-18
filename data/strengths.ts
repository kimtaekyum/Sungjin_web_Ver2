export interface StrengthPhoto {
  src: string;
  ratio: number;
  scale?: number;
}

export interface Strength {
  id: number;
  title: string;
  description: string;
  icon: string;
  photos?: StrengthPhoto[];
  fanOverlap?: "tight" | "normal" | "loose";
  fanMobileHeight?: number;
}

export const strengths: Strength[] = [
  {
    id: 1,
    title: "대입 세미나",
    description:
      "매년 입시 정책 변화와 주변 고등학교 특성을 분석하는 세미나를 진행합니다.",
    icon: "graduation-cap",
    photos: [
      { src: "/images/strengths/seminar/2.jpeg", ratio: 1.334 },
      { src: "/images/strengths/seminar/1.png", ratio: 1.0, scale: 1.25 },
      { src: "/images/strengths/seminar/3.jpeg", ratio: 1.334 },
    ],
  },
  {
    id: 2,
    title: "1대1 밀착 첨삭",
    description:
      "강의 전후 첨삭실에서 1대1 문제 풀이로 개념을 완벽히 자기 것으로 만듭니다.",
    icon: "pencil",
    photos: [
      { src: "/images/strengths/tutoring/1.jpeg", ratio: 1.334 },
      { src: "/images/strengths/tutoring/2.jpeg", ratio: 0.562, scale: 1.25 },
      { src: "/images/strengths/tutoring/3.jpeg", ratio: 1.333 },
    ],
  },
  {
    id: 3,
    title: "클래스톡톡",
    description:
      "매일 담당 선생님이 카톡으로 출결·숙제·진도를 안내드립니다.",
    icon: "comments",
    photos: [
      { src: "/images/strengths/classtalk/1.png", ratio: 0.981 },
      { src: "/images/strengths/classtalk/2.png", ratio: 0.952, scale: 1.25 },
      { src: "/images/strengths/classtalk/3.png", ratio: 0.626 },
    ],
    fanOverlap: "loose",
  },
  {
    id: 4,
    title: "초-중-고 로드맵",
    description:
      "장기적 학습 커리큘럼과 학생 개인별 1:1 상담으로 약점을 보완합니다.",
    icon: "map-location-dot",
    photos: [
      { src: "/images/strengths/roadmap/1.jpeg", ratio: 0.562 },
      { src: "/images/strengths/roadmap/2.jpeg", ratio: 0.709 },
    ],
    fanOverlap: "loose",
    fanMobileHeight: 210,
  },
  {
    id: 5,
    title: "개념 백지 테스트",
    description:
      "수학 백지 테스트로 개념 이해도를 점검하고 부족한 빈틈을 채웁니다.",
    icon: "file-lines",
    photos: [
      { src: "/images/strengths/blanktest/1.jpeg", ratio: 0.75 },
      { src: "/images/strengths/blanktest/2.png", ratio: 0.99 },
    ],
  },
  {
    id: 6,
    title: "동기부여",
    description:
      "명확한 목표 제시와 함께 학습 의지를 북돋고 집중력·성실함을 배양합니다.",
    icon: "fire",
    photos: [
      { src: "/images/strengths/motivation/1.jpeg", ratio: 0.651 },
      { src: "/images/strengths/motivation/2.jpeg", ratio: 1.334 },
    ],
  },
];
