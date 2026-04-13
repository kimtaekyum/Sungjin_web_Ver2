export const ACADEMY_INFO = {
  name: "성진학원",
  slogan: "대학 잘 보내는 1대1 맞춤 첨삭 전문 성진학원",
  subSlogan: "초4부터 고3까지, 신월동에서 30년 이상 검증된 입시 전문 학원",
  description:
    "초등학교 4학년부터 고3까지 국어, 영어, 수학 전 과목을 지도하는 입시 중심 학원입니다. 강의 후 첨삭실에서 진행되는 1대1 밀착 케어로 수업 시간에 배운 개념을 문제에 완벽히 적용하도록 만듭니다. 신월동에서 30년 이상 꾸준히 성장해 온 성진학원의 검증된 강사진이 학생들의 성공적인 대학 진학을 확실하게 책임지겠습니다.",
  phone: "02-2693-6123",
  address: "서울 양천구 오목로 15 지우빌딩 301, 401호(상담실)",
  addressLegacy: "서울 양천구 신월동 439-17",
  registrationNo: "교육청 등록번호 제 977호",
  operatingHours: "월~토 13:00 ~ 22:00 (일·공휴일 휴원)",
  naverMapLink: "https://map.naver.com/p/entry/place/37941852",
  kakaoLink: "#",
  established: "30",
} as const;

export const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "학원소개", href: "/about" },
  { label: "수업 안내", href: "/programs" },
  { label: "실적 & 후기", href: "/results" },
  { label: "공지사항", href: "/notices" },
  { label: "상담 & 등록", href: "/contact" },
] as const;
