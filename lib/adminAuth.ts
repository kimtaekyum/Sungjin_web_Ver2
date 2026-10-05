import { supabaseAdmin } from "./supabaseServer";

/** 서버에서 로그인 토큰을 검증한다. 공개 환경 변수는 인증에 사용하지 않는다. */
export async function authenticated(request: Request): Promise<boolean> {
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return false;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return !error && !!data.user;
}
