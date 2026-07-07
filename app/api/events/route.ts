import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

/**
 * 공개 학사 일정 조회 API.
 *
 * 홈 달력이 브라우저에서 Supabase 도메인(*.supabase.co)으로 직접 접속하면
 * 광고차단·보안 확장프로그램이 그 요청을 막아 달력이 빈 채로 보이는 경우가 있다.
 * 같은 도메인(sjac.co.kr) 경유로 내려주면 어떤 방문자에게도 차단되지 않는다.
 *
 * 민감정보 없음: events 테이블은 제목/날짜뿐인 공개 데이터다.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events, {
    headers: {
      // CDN에 1분 캐시: 관리자에서 일정 추가 후 최대 1분 내 반영.
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
    },
  });
}
