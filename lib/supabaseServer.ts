import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Supabase 클라이언트. SERVICE_ROLE 키는 RLS를 "우회"하므로
 * 절대 브라우저로 노출되면 안 된다. 이 파일은 NEXT_PUBLIC_ 접두사가 없는
 * env를 참조하므로 클라이언트 번들에 포함되면 빌드/런타임에 바로 실패한다.
 *
 * 사용처:
 * - /api/sync-blog (Vercel Cron, 관리자 수동 동기화) — notices INSERT + processed_blog_posts 조회/기록
 * - /api/consultations (공개 상담 폼) — consultations INSERT + rate-limit 조회
 *
 * 관리자 브라우저에서의 CRUD는 이 파일이 아니라 로그인 세션이 붙은 `lib/supabase.ts`(anon)를 쓴다.
 *
 * 지연 초기화: env가 빠진 상태에서 모듈이 import만 되어도 던지지 않도록,
 * 실제 호출 시점에 검증한다.
 */

let cached: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
  }
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. Supabase → Settings → API에서 service_role 키를 복사해 .env.local과 Vercel 환경변수에 추가하세요."
    );
  }

  cached = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}

/**
 * Proxy로 감싸 `supabaseAdmin.from(...)`처럼 기존 문법을 그대로 유지하되,
 * 실제 메서드 호출 시점에 클라이언트를 생성한다.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
