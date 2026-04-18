import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-text-sub mb-8">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-3 text-[15px] font-medium hover:bg-[#8A1519] transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-white text-primary border-[1.5px] border-primary px-6 py-3 text-[15px] font-medium hover:bg-primary-light transition-colors"
        >
          상담 신청
        </Link>
      </div>
    </section>
  );
}
