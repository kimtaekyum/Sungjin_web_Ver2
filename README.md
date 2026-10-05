성진학원 웹사이트 (Next.js 16).

## 내신분석실

- 학생: `/exam-analysis`에서 중등·고등 → 연도 → 학기 → 과목을 선택해 PDF를 다운로드합니다.
- 학교명·학년·중간/기말고사 필터와 학교명/제목 검색을 지원합니다. 검색은 선택한 분류의 전체 자료에 적용됩니다.
- 관리자: `/admin` 로그인 후 **강의영상 옆 내신분석실 탭**에서 50MB 이하 PDF를 등록하거나 삭제합니다.
- 등록 시 학교명·학년·시험 구분을 선택할 수 있으며, 공통 자료는 비워둘 수 있습니다. 기존 자료도 전체 목록에서 계속 표시됩니다.
- 파일은 Supabase Storage의 비공개 `exam-analysis` 버킷에 저장됩니다. 버킷이 없으면 첫 업로드 시 자동 생성됩니다. 파일 목록과 다운로드는 서버 API를 거치며, 업로드는 서명된 URL로 Storage에 직접 전송합니다.
- 서버 환경변수 `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL` 및 관리자 Supabase Auth 계정이 필요합니다.

## 상담 신청 자동 처리

- 접수 시각부터 7일(168시간) 이상 지난 `new` 신청을 `contacted`(연락 완료)로 변경합니다.
- Vercel Cron이 매일 한국 시간 자정 일정으로 실행하며, 운영 환경의 기존 `CRON_SECRET`으로 인증합니다.
- 관리자 목록을 불러올 때도 처리하고, 화면이 열려 있으면 5분마다 목록을 갱신합니다. 브라우저 시각 대신 서버 시각으로 계산합니다.
- 연락 완료·등록·보류 상태는 변경하지 않습니다.

## Getting Started

PC와 같은 Wi-Fi의 휴대폰에서 테스트하려면 `npm run dev:lan`을 실행합니다.
PC는 `http://localhost:3000`, 휴대폰은 `http://<Mac의 Wi-Fi IP>:3000`으로 접속합니다.
Mac의 Wi-Fi IP는 `ipconfig getifaddr en0`으로 확인합니다.
내신분석실 경로는 `/exam-analysis`, 관리자 자료 등록 경로는 `/admin/resources`입니다.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
